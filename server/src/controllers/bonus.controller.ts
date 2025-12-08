import { BonusService } from "../service/bonus.service.js";

export class BonusController {
  /**
   * Получить все бонусы текущего агента
   */
  public static async getBonuses(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const bonuses = await BonusService.getAgentBonuses(refreshToken);
      return res.json(bonuses);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Получить статистику бонусов текущего агента
   */
  public static async getBonusStats(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const stats = await BonusService.getAgentBonusStats(refreshToken);
      return res.json(stats);
    } catch (e) {
      next(e);
    }
  }
}

