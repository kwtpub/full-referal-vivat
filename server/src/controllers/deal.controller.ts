import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/error-api.js";
import { DealService } from "../service/deal.service.js";

export class DealController {

  public static async create(req: any, res: any, next: any) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest(
          400,
          'Ошибка валидации: ' +
            errors
              .array()
              .map((e) => e.msg)
              .join(', '),
        );
      }
      const {interestBoat, quantity, stage, status} = req.body;
      const refreshToken = req.cookies.refreshToken;
      const clientId = req.params.clientId;
      const deal = await DealService.create(
        clientId,
        refreshToken,
        interestBoat,
        quantity,
        stage,
        status,
      );
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: any, res: any, next: any) {
    try {
      const dealId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const deletedDeal = await DealService.delete(dealId, refreshToken);
      return res.json(deletedDeal);
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: any, res: any, next: any) {
    try {
      const dealId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const { interestBoat, quantity, stage, status } = req.body;
      const updatedDeal = await DealService.update(
        dealId,
        refreshToken,
        interestBoat,
        quantity,
        stage,
        status,
      );
      return res.json(updatedDeal);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Получить цены на все типы лодок
   */
  public static async getBoatPrices(req: any, res: any, next: any) {
    try {
      const prices = DealService.getBoatPrices();
      return res.json(prices);
    } catch (e) {
      next(e);
    }
  }

  public static async getDeals(req: any, res: any, next: any) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const deals = await DealService.getDeals(refreshToken);
      return res.json(deals);
    } catch (e) {
      next(e);
    }
  }

  public static async getDealsByClientId(req: any, res: any, next: any) {
    try {
      const clientId = req.params.clientId;
      const deals = await DealService.getDealsByClientId(clientId);
      return res.json(deals);
    } catch (e) {
      next(e);
    }
  }

  public static async getDealById(req: any, res: any, next: any) {
    try {
      const dealId = req.params.id;
      const deal = await DealService.getDealById(dealId);
      return res.json(deal);
    } catch (e) {
      next(e);
    }
  }

  public static async getDealsByAgentId(req: any, res: any, next: any) {
    try {
      const agentId = req.params.agentId;
      const deals = await DealService.getDealsByAgentId(agentId);
      return res.json(deals);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Подтверждение сделки админом
   */
  public static async approveDeal(req: any, res: any, next: any) {
    try {
      const dealId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const approvedDeal = await DealService.approveDeal(dealId, refreshToken);
      return res.json(approvedDeal);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Отклонение сделки админом
   */
  public static async rejectDeal(req: any, res: any, next: any) {
    try {
      const dealId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const rejectedDeal = await DealService.rejectDeal(dealId, refreshToken);
      return res.json(rejectedDeal);
    } catch (e) {
      next(e);
    }
  }
}
