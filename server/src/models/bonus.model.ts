import { prisma } from "../prisma.singleton.js";

export class BonusModel {
  /**
   * Создать бонус для сделки
   */
  public static async create(
    dealId: string,
    agentId: string,
    percent: number,
    amount: number
  ) {
    return prisma.bonus.create({
      data: {
        dealId,
        agentId,
        percent,
        amount,
      },
    });
  }

  /**
   * Получить бонус по ID сделки
   */
  public static async getByDealId(dealId: string) {
    return prisma.bonus.findUnique({
      where: { dealId },
    });
  }

  /**
   * Получить все бонусы агента
   */
  public static async getByAgentId(agentId: string) {
    return prisma.bonus.findMany({
      where: { agentId },
      include: {
        deal: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Удалить бонус по ID сделки
   */
  public static async deleteByDealId(dealId: string) {
    return prisma.bonus.delete({
      where: { dealId },
    });
  }

  /**
   * Получить общую сумму бонусов агента
   */
  public static async getTotalByAgentId(agentId: string) {
    const result = await prisma.bonus.aggregate({
      where: { agentId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  /**
   * Подсчитать количество закрытых сделок агента
   */
  public static async getClosedDealsCount(agentId: string) {
    return prisma.deal.count({
      where: {
        agentId,
        stage: "Закрыто",
      },
    });
  }
}

