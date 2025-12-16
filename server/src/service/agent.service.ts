import { AgentModel } from '../models/agent.model.js';
import bcrypt from 'bcrypt';
import { createAgentDto } from '../dtos/agent.dto.js';
import { ApiError } from '../exceptions/error-api.js';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service.js';
import { mailService } from './mail.service.js';
import { DealModel } from '../models/deal.model.js';
import { BonusModel } from '../models/bonus.model.js';
import { BonusService } from './bonus.service.js';

export class AgentService {
  public static async registeration(
    name: string,
    email: string,
    password: string,
  ) {
    const candidate = await AgentModel.findByEmail(email);
    if (candidate) {
      throw ApiError.BadRequest(400, `Пользователь с ${email} уже авторизован`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();

    const user = await AgentModel.create(
      name,
      email,
      hashPassword,
      activationLink,
    );

    //     // Отправляем email без ожидания, чтобы избежать таймаута
    // try {
    //   const apiUrl = process.env.API_URL;
    //   if (!apiUrl) {
    //     console.warn('API_URL не задан, письмо активации не отправлено');
    //   } else {
    //     const activationUrl = `${apiUrl}/api/activate/${activationLink}`;
    //     await mailService.sendActivationMail(email, activationUrl);
    //   }
    // } catch (emailError: unknown) {
    //   console.warn(
    //     'Ошибка отправки email активации:',
    //     emailError instanceof Error ? emailError.message : emailError
    //   );
    //   // Продолжаем работу даже если email не отправился
    // }
    const agent = createAgentDto({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    });
    const tokens = TokenService.generateTokens(agent);
    await TokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, agent };
  }

  public static async activation(activationLink: string) {
    const agent = AgentModel.findByActivationLink(activationLink);
  }

  public static async login(email: string, password: string, name?: string) {
    const agent = await AgentModel.findByEmail(email);
    if (!agent) {
      throw ApiError.BadRequest(401, 'Пользователь с такой почтой не найден');
    }
    const isPasswordCurrect = await bcrypt.compare(
      password,
      agent.passwordHash,
    );
    if (!isPasswordCurrect) {
      throw ApiError.BadRequest(401, 'Неверный пароль');
    }
    const agentDto = createAgentDto({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      isActive: agent.isActive,
      isAdmin: agent.isAdmin,
    });
    const tokens = TokenService.generateTokens(agentDto);
    await TokenService.saveToken(agent.id, tokens.refreshToken);
    return { ...tokens, agentDto };
  }

  public static async logout(refreshToken: string) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  public static async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError('Refresh token отсутствует');
    }
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.UnauthorizedError('Токен истёк или недействителен');
    }
    const tokenFromDB = await TokenService.findToken(refreshToken);
    if (!tokenFromDB) {
      throw ApiError.UnauthorizedError('Токен не найден в базе данных');
    }
    const agent = await AgentModel.findByEmail((agentData as any).email);
    if (!agent) {
      throw ApiError.UnauthorizedError('Пользователь не найден');
    }
    const agentDto = createAgentDto({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      isActive: agent.isActive,
      isAdmin: agent.isAdmin,
    });
    const tokens = TokenService.generateTokens(agentDto);
    await TokenService.saveToken(agent.id, tokens.refreshToken);
    return { ...tokens, agent: agentDto };
  }

  public static async getAllUsers() {
    return AgentModel.findAll();
  }

  /**
   * Получить список агентов со статистикой для админ-панели
   */
  public static async getAgentsWithStats() {
    const agents = await AgentModel.findAll();
    
    // Для каждого агента получаем статистику
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const stats = await this.getAgentStats(agent.id);
        return {
          ...agent,
          clientsCount: stats.clientsCount,
          salesCount: stats.salesCount,
          totalBonuses: stats.totalBonuses,
        };
      })
    );
    
    return agentsWithStats;
  }

  /**
   * Получить общую статистику для админ-панели
   */
  public static async getTotalStats() {
    // Получаем всех агентов (не админов)
    const agents = await AgentModel.findAll();
    const nonAdminAgents = agents.filter(a => !a.isAdmin);
    
    let totalClients = 0;
    let totalSales = 0;
    const uniqueClientIds = new Set<string>();
    
    // Для каждого агента получаем его сделки
    for (const agent of nonAdminAgents) {
      const deals = await DealModel.getDealsByAgentId(agent.id);
      
      // Считаем уникальных клиентов
      deals.forEach(deal => uniqueClientIds.add(deal.clientId));
      
      // Считаем закрытые И подтвержденные сделки (продажи)
      const salesCount = deals.filter(deal => deal.stage === 'Закрыто' && !deal.pendingApproval).length;
      totalSales += salesCount;
    }
    
    totalClients = uniqueClientIds.size;
    
    return {
      totalClients,
      totalSales,
    };
  }

  /**
   * Обновить данные агента
   */
  public static async update(agentId: string, name: string, email: string, isActive: boolean) {
    // Проверяем длину имени
    if (name.trim().length < 3 || name.trim().length > 25) {
      throw ApiError.BadRequest(400, 'Имя должно быть от 3 до 25 символов');
    }

    // Проверяем, существует ли агент
    const agent = await AgentModel.findByID(agentId);
    if (!agent) {
      throw ApiError.BadRequest(404, 'Агент не найден');
    }

    // Проверяем, не занят ли email другим агентом
    if (email !== agent.email) {
      const existingAgent = await AgentModel.findByEmail(email);
      if (existingAgent && existingAgent.id !== agentId) {
        throw ApiError.BadRequest(400, 'Email уже используется другим агентом');
      }
    }

    return AgentModel.update(agentId, { name: name.trim(), email, isActive });
  }

  /**
   * Получить статистику агента для админ-панели
   */
  public static async getAgentStats(agentId: string) {
    // Получаем все сделки агента
    const deals = await DealModel.getDealsByAgentId(agentId);
    
    // Считаем уникальных клиентов
    const uniqueClientIds = new Set(deals.map(deal => deal.clientId));
    const clientsCount = uniqueClientIds.size;
    
    // Считаем закрытые И подтвержденные сделки (продажи)
    const salesCount = deals.filter(deal => deal.stage === 'Закрыто' && !deal.pendingApproval).length;
    
    // Получаем общую сумму бонусов
    const totalBonuses = await BonusModel.getTotalByAgentId(agentId);
    
    return {
      clientsCount,
      salesCount,
      totalBonuses: Number(totalBonuses) || 0,
    };
  }

  /**
   * Удалить агента (только для админов)
   * Удаляет все связанные данные: бонусы, сделки, клиентов, токены
   */
  public static async delete(agentId: string, refreshToken: string) {
    // Проверяем права доступа
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.UnauthorizedError('Токен устарел');
    }

    const admin = agentData as { id: string; isAdmin: boolean };
    if (!admin.isAdmin) {
      throw ApiError.BadRequest(403, 'Доступ запрещен. Только администраторы могут удалять агентов.');
    }

    // Проверяем, существует ли агент
    const agent = await AgentModel.findByID(agentId);
    if (!agent) {
      throw ApiError.BadRequest(404, 'Агент не найден');
    }

    // Нельзя удалить админа
    if (agent.isAdmin) {
      throw ApiError.BadRequest(400, 'Нельзя удалить администратора');
    }

    // Удаляем все связанные данные в транзакции
    const { prisma } = await import('../prisma.singleton.js');
    await prisma.$transaction(async (tx) => {
      // 1. Удаляем бонусы агента
      await tx.bonus.deleteMany({
        where: { agentId },
      });

      // 2. Удаляем сделки агента (бонусы уже удалены, так что каскадное удаление бонусов не сработает)
      await tx.deal.deleteMany({
        where: { agentId },
      });

      // 3. Удаляем клиентов агента
      await tx.client.deleteMany({
        where: { agentId },
      });

      // 4. Удаляем токены агента (каскадное удаление через схему)
      // Токены удалятся автоматически через onDelete: Cascade

      // 5. Удаляем самого агента
      await tx.agent.delete({
        where: { id: agentId },
      });
    });

    return { message: 'Агент успешно удален' };
  }
}
