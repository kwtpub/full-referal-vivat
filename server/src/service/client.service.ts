import { ClientModel } from "../models/client.model.js";
import { DealModel } from "../models/deal.model.js";
import { BonusService } from "./bonus.service.js";
import { TokenService } from "./token.service.js";
import { ApiError } from "../exceptions/error-api.js";

export class ClientService {
  // Нормализация российского номера телефона к формату +7 (XXX) XXX-XX-XX
  private static normalizePhone(phone: string): string {
    // Удаляем все символы кроме цифр
    let digits = phone.replace(/\D/g, '');
    
    // Если номер начинается с 8, заменяем на 7
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    
    // Если не начинается с 7, добавляем 7
    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }
    
    // Проверяем длину (должно быть 11 цифр: 7 + 10 цифр)
    if (digits.length !== 11) {
      throw ApiError.BadRequest(400, 'Неверный формат российского номера телефона');
    }
    
    // Форматируем в +7 (XXX) XXX-XX-XX
    const code = digits.slice(1, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 9);
    const part3 = digits.slice(9, 11);
    
    return `+7 (${code}) ${part1}-${part2}-${part3}`;
  }

  public static async create(name: string, phone: string, refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError('Refresh token отсутствует');
    }
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.BadRequest(400, 'токен устарел');
    }
    const agentId = (agentData as { id: string }).id;
    if (!agentId) {
      throw ApiError.BadRequest(400, 'Неверный формат токена');
    }
    
    // Нормализуем номер телефона перед сохранением
    const normalizedPhone = this.normalizePhone(phone);
    
    return ClientModel.create(name, normalizedPhone, agentId);
  }

  public static async delete(phone: string) {
    try{
      const client = await ClientModel.delete(phone)
      return client;
    } catch(e) {
      throw ApiError.BadRequest(409, 'Ошибка удаления');
    }
  }

  public static async deleteById(id: string, refreshToken: string) {
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.BadRequest(400, 'токен устарел');
    }
    
    const admin = agentData as { id: string; isAdmin: boolean };
    if (!admin.isAdmin) {
      throw ApiError.BadRequest(403, 'Доступ запрещен. Только администраторы могут удалять клиентов.');
    }

    try {
      // Сначала удаляем все сделки клиента и связанные бонусы
      const deals = await DealModel.getDealsByClientId(id);
      
      for (const deal of deals) {
        // Удаляем бонус, если он есть
        await BonusService.deleteBonusForDeal(deal.id);
        // Удаляем сделку
        await DealModel.delete(deal.id);
      }
      
      // Затем удаляем клиента
      const client = await ClientModel.deleteById(id);
      return client;
    } catch(e: any) {
      if (e.code === 'P2025') {
        throw ApiError.BadRequest(404, 'Клиент не найден');
      }
      throw ApiError.BadRequest(400, `Ошибка удаления клиента: ${e.message || e}`);
    }
  }

  public static async update(id: string, name: string, phone: string) {
    try {
      // Нормализуем номер телефона перед обновлением
      const normalizedPhone = this.normalizePhone(phone);
      const updateData = await ClientModel.update(id, name, normalizedPhone)
      return updateData;
    } catch(e: any) {
      if (e.statusCode === 400 && e.message?.includes('формат')) {
        throw e;
      }
      throw ApiError.BadRequest(409, `Ошибка update ${e}`);
    }
  }

  public static async getClients() {
    try {
      const clients = await ClientModel.getClients();
      return clients;
    } catch(e) {
      throw ApiError.BadRequest(409, `Ошибка getClients ${e}`);
    }
  }

  public static async getClientsFromAgent(agentId: any) {
    try {
      const clients = await ClientModel.getClientsFromAgent(agentId);
      return clients;
    } catch (e) {
      throw ApiError.BadRequest(409, `Ошибка getClientsFromAgent ${e}`);
    }
  }

  public static async findByPhone(phone: string) {
    try {
      // Нормализуем номер телефона перед поиском
      const normalizedPhone = this.normalizePhone(phone);
      const client = await ClientModel.findByPhone(normalizedPhone);
      return client;
    } catch (e: any) {
      // Если ошибка нормализации, возвращаем null (клиент не найден)
      if (e.statusCode === 400 && e.message?.includes('формат')) {
        return null;
      }
      throw ApiError.BadRequest(409, `Ошибка поиска клиента ${e}`);
    }
  }

}
