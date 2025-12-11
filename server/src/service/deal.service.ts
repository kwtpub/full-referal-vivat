import { ApiError } from "../exceptions/error-api.js";
import { DealModel, Stage, Status } from "../models/deal.model.js";
import { TokenService } from "./token.service.js";
import { BonusService } from "./bonus.service.js";
import { ClientModel } from "../models/client.model.js";


export class DealService {
  

  public static async create(clientId: string, 
    refreshToken: string, 
    interestBoat: string, 
    quantity: number, 
    stage: Stage, 
    status: Status) {
    
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.BadRequest(400, 'токен устарел');
    }
    const agentId = (agentData as { id: string }).id;
    if (!agentId) {
      throw ApiError.BadRequest(400, 'Неверный формат токена');
    }

    // Проверяем существование клиента перед созданием сделки
    const client = await ClientModel.findById(clientId);
    if (!client) {
      throw ApiError.BadRequest(404, 'Клиент не найден');
    }

    // Сумма сделки может быть задана вручную или оставлена null
    const amount = null;

    // Если сделка закрыта - устанавливаем pendingApproval = true
    const pendingApproval = stage === 'Закрыто';

    const deal = await DealModel.create(clientId, agentId, interestBoat, quantity, stage, status, amount, pendingApproval);
    
    // Бонусы НЕ начисляем автоматически - только после подтверждения админом
    
    return deal;
  }

  public static async delete(id: string, refreshToken: string) {
    try {
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.BadRequest(400, 'токен устарел');
    }
    const deletedDeal = await DealModel.delete(id)
    return deletedDeal

    } catch(e) {
      throw ApiError.BadRequest(400, `Ошибка delete deal ${e}`);
    }
  }

  public static async update(
    id: string,
    refreshToken: string,
    interestBoat: string,
    quantity: number,
    stage: Stage,
    status: Status,
  ) {
    try {
      const agentData = await TokenService.validateRefresh(refreshToken);
      if (!agentData) {
        throw ApiError.BadRequest(400, 'токен устарел');
      }
      const agentId = (agentData as { id: string }).id;
      
      // Получаем текущую сделку для проверки изменения статуса
      const currentDeal = await DealModel.getDealById(id);
      if (!currentDeal) {
        throw ApiError.BadRequest(404, 'Сделка не найдена');
      }
      
      const wasOpen = currentDeal.stage !== 'Закрыто';
      const willBeClosed = stage === 'Закрыто';
      
      // Сохраняем текущую сумму или оставляем null
      const amount = currentDeal.amount ? Number(currentDeal.amount) : null;
      
      // Определяем значение pendingApproval
      let pendingApproval = currentDeal.pendingApproval;
      
      if (willBeClosed) {
        // Агент закрывает сделку - устанавливаем ожидание подтверждения
        pendingApproval = true;
      } else if (!willBeClosed && !wasOpen) {
        // Агент открывает обратно ранее закрытую сделку - сбрасываем ожидание
        pendingApproval = false;
      }
      // В остальных случаях (сделка остается открытой) - сохраняем текущее значение
      
      const updatedDeal = await DealModel.update(
        id,
        interestBoat,
        quantity,
        stage,
        status,
        amount,
        pendingApproval,
      );
      
      // Обработка бонусов при изменении статуса
      // Если сделка открывается обратно - удаляем бонус (если был)
      if (!wasOpen && !willBeClosed) {
        await BonusService.deleteBonusForDeal(id);
      }
      // Бонусы теперь начисляются только после подтверждения админом
      
      return updatedDeal;
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка update ${e}`);
    }
  }

  public static async getDeals(refreshToken?: string) {
    try {
      if (refreshToken) {
        const agentData = await TokenService.validateRefresh(refreshToken);
        if (!agentData) {
          throw ApiError.BadRequest(400, 'токен устарел');
        }
        
        const agent = agentData as { id: string; isAdmin: boolean };
        
        // Если админ - возвращаем все сделки
        if (agent.isAdmin) {
          return DealModel.getDeals();
        }
        
        // Если обычный агент - только его сделки
        const agentId = agent.id;
        if (!agentId) {
          throw ApiError.BadRequest(400, 'Неверный формат токена');
        }
        return DealModel.getDealsByAgentId(agentId);
      }
      return DealModel.getDeals();
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка получения всех заказов ${e}`);
    }
  }

  public static async getDealsByClientId(clientId: string) {
    try {
      return DealModel.getDealsByClientId(clientId);
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка получения сделок клиента ${e}`);
    }
  }

  public static async getDealsByAgentId(agentId: string) {
    try {
      return DealModel.getDealsByAgentId(agentId);
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка получения сделок агента ${e}`);
    }
  }

  public static async getDealById(id: string) {
    try {
      const deal = await DealModel.getDealById(id);
      if (!deal) {
        throw ApiError.BadRequest(404, 'Сделка не найдена');
      }
      return deal;
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка получения сделки ${e}`);
    }
  }

  /**
   * Подтверждение сделки админом
   */
  public static async approveDeal(id: string, refreshToken: string) {
    try {
      const agentData = await TokenService.validateRefresh(refreshToken);
      if (!agentData) {
        throw ApiError.BadRequest(400, 'токен устарел');
      }
      
      const admin = agentData as { id: string; isAdmin: boolean };
      if (!admin.isAdmin) {
        throw ApiError.BadRequest(403, 'Доступ запрещен. Только администраторы могут подтверждать сделки.');
      }

      const deal = await DealModel.getDealById(id);
      if (!deal) {
        throw ApiError.BadRequest(404, 'Сделка не найдена');
      }

      if (!deal.pendingApproval) {
        throw ApiError.BadRequest(400, 'Сделка не требует подтверждения');
      }

      // Подтверждаем сделку
      const approvedDeal = await DealModel.approveDeal(id);

      // Начисляем бонус агенту
      if (deal.amount && Number(deal.amount) > 0) {
        await BonusService.createBonusForDeal(id, deal.agentId, Number(deal.amount));
      }

      return approvedDeal;
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка подтверждения сделки: ${e}`);
    }
  }

  /**
   * Отклонение сделки админом
   */
  public static async rejectDeal(id: string, refreshToken: string) {
    try {
      const agentData = await TokenService.validateRefresh(refreshToken);
      if (!agentData) {
        throw ApiError.BadRequest(400, 'токен устарел');
      }
      
      const admin = agentData as { id: string; isAdmin: boolean };
      if (!admin.isAdmin) {
        throw ApiError.BadRequest(403, 'Доступ запрещен. Только администраторы могут отклонять сделки.');
      }

      const deal = await DealModel.getDealById(id);
      if (!deal) {
        throw ApiError.BadRequest(404, 'Сделка не найдена');
      }

      if (!deal.pendingApproval) {
        throw ApiError.BadRequest(400, 'Сделка не требует подтверждения');
      }

      // Отклоняем сделку
      const rejectedDeal = await DealModel.rejectDeal(id);

      return rejectedDeal;
    } catch (e) {
      throw ApiError.BadRequest(400, `Ошибка отклонения сделки: ${e}`);
    }
  }
}
