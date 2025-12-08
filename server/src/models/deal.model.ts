import { prisma } from "../prisma.singleton.js";

export type InterestBoat = "HardTop" | "ClassicBoat" | "Bowrider";
export type Status = "Холодный" | "Средний" | "Горячий";
export type Stage = "Закрыто" | "Открыто" | "Согласование";

// Стоимость каждого типа лодки в рублях
export const BOAT_PRICES: Record<InterestBoat, number> = {
  HardTop: 5500000,      // 5.5 млн ₽
  ClassicBoat: 3200000,  // 3.2 млн ₽
  Bowrider: 4100000,     // 4.1 млн ₽
};

// Получить стоимость лодки
export function getBoatPrice(boat: InterestBoat): number {
  return BOAT_PRICES[boat] || 0;
}

// Рассчитать общую сумму сделки (цена * количество)
export function calculateDealAmount(boat: InterestBoat, quantity: number): number {
  return getBoatPrice(boat) * quantity;
}

export class DealModel {
  
  public static async create(
    clientId: string,
    agentId: string,
    interestBoat: InterestBoat,
    quantity: number,
    stage: Stage,
    status: Status,
    amount: number,
    pendingApproval: boolean = false,
  ) {
    return prisma.deal.create({
      data: {
        clientId,
        agentId,
        interestBoat,
        quantity,
        stage,
        status,
        amount,
        pendingApproval,
      },
    });
  }

  public static async delete(id: string){
    return prisma.deal.delete({
      where: {
        id
      }
    })
  }

  public static async update(
    id: string,
    interestBoat: InterestBoat,
    quantity: number,
    stage: Stage,
    status: Status,
    amount: number,
    pendingApproval: boolean,
  ) {
    return prisma.deal.update({
      where: {
        id,
      },
      data: {
        interestBoat,
        quantity,
        stage,
        status,
        amount,
        pendingApproval,
      },
    });
  }

  public static async getDeals() {
    return prisma.deal.findMany({
      include: {
        client: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  public static async getDealsByAgentId(agentId: string) {
    return prisma.deal.findMany({
      where: {
        agentId,
      },
      include: {
        client: true,
      },
    });
  }

  public static async getDealsByClientId(clientId: string) {
    return prisma.deal.findMany({
      where: {
        clientId,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  public static async getDealById(id: string) {
    return prisma.deal.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Подтверждение сделки админом
   */
  public static async approveDeal(id: string) {
    return prisma.deal.update({
      where: {
        id,
      },
      data: {
        pendingApproval: false,
        closedAt: new Date(),
      },
    });
  }

  /**
   * Отклонение сделки админом (возвращаем в "Открыто")
   */
  public static async rejectDeal(id: string) {
    return prisma.deal.update({
      where: {
        id,
      },
      data: {
        pendingApproval: false,
        stage: 'Открыто',
      },
    });
  }
}
