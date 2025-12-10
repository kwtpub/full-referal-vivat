import { BonusModel } from "../models/bonus.model.js";
import { ApiError } from "../exceptions/error-api.js";
import { TokenService } from "./token.service.js";

/**
 * Прогрессивная шкала бонусов:
 * 0 продаж - 2%
 * 3 продажи - 3%
 * 8 продаж - 4%
 * 15 продаж - 5.5%
 */
const BONUS_TIERS = [
  { minSales: 15, percent: 5.5 },
  { minSales: 8, percent: 4 },
  { minSales: 3, percent: 3 },
  { minSales: 0, percent: 2 },
];

export class BonusService {
  /**
   * Вычислить процент бонуса на основе количества закрытых сделок
   */
  public static calculateBonusPercent(closedDealsCount: number): number {
    for (const tier of BONUS_TIERS) {
      if (closedDealsCount >= tier.minSales) {
        return tier.percent;
      }
    }
    return 2; // По умолчанию 2%
  }

  /**
   * Создать бонус для закрытой сделки
   */
  public static async createBonusForDeal(
    dealId: string,
    agentId: string,
    dealAmount: number
  ) {
    // Проверяем, не существует ли уже бонус для этой сделки
    const existingBonus = await BonusModel.getByDealId(dealId);
    if (existingBonus) {
      throw ApiError.BadRequest(400, "Бонус для этой сделки уже начислен");
    }

    // Получаем количество закрытых сделок агента (без текущей)
    const closedDealsCount = await BonusModel.getClosedDealsCount(agentId);
    
    // Вычисляем процент бонуса
    const percent = this.calculateBonusPercent(closedDealsCount);
    
    // Вычисляем сумму бонуса
    const bonusAmount = (dealAmount * percent) / 100;

    // Создаем бонус
    const bonus = await BonusModel.create(dealId, agentId, percent, bonusAmount);
    
    return bonus;
  }

  /**
   * Получить все бонусы агента
   */
  public static async getAgentBonuses(refreshToken: string) {
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.UnauthorizedError("Токен устарел");
    }
    
    const agentId = (agentData as { id: string }).id;
    const bonuses = await BonusModel.getByAgentId(agentId);
    
    return bonuses;
  }

  /**
   * Получить статистику бонусов агента
   */
  public static async getAgentBonusStats(refreshToken: string) {
    const agentData = await TokenService.validateRefresh(refreshToken);
    if (!agentData) {
      throw ApiError.UnauthorizedError("Токен устарел");
    }
    
    const agentId = (agentData as { id: string }).id;
    
    // Получаем количество закрытых сделок
    const closedDealsCount = await BonusModel.getClosedDealsCount(agentId);
    
    // Получаем текущий процент
    const currentPercent = this.calculateBonusPercent(closedDealsCount);
    
    // Получаем общую сумму бонусов
    const totalBonuses = await BonusModel.getTotalByAgentId(agentId);
    
    // Вычисляем следующий уровень
    let nextTier = null;
    for (let i = BONUS_TIERS.length - 1; i >= 0; i--) {
      if (closedDealsCount < BONUS_TIERS[i].minSales) {
        nextTier = {
          salesNeeded: BONUS_TIERS[i].minSales - closedDealsCount,
          nextPercent: BONUS_TIERS[i].percent,
        };
        break;
      }
    }

    return {
      closedDealsCount,
      currentPercent,
      totalBonuses: Number(totalBonuses),
      nextTier,
    };
  }

  /**
   * Удалить бонус при отмене/изменении сделки
   */
  public static async deleteBonusForDeal(dealId: string) {
    const existingBonus = await BonusModel.getByDealId(dealId);
    if (existingBonus) {
      await BonusModel.deleteByDealId(dealId);
    }
  }
}

