import $api from '../http';

export interface Bonus {
  id: string;
  dealId: string;
  agentId: string;
  percent: string;
  amount: string;
  createdAt: string;
  deal?: {
    id: string;
    interestBoat: string;
    amount: string;
    client: {
      id: string;
      name: string;
      phone: string;
    };
  };
}

export interface BonusStats {
  closedDealsCount: number;
  currentPercent: number;
  totalBonuses: number;
  nextTier: {
    salesNeeded: number;
    nextPercent: number;
  } | null;
}

export default class BonusService {
  static async getBonuses() {
    return $api.get<Bonus[]>('/bonuses');
  }

  static async getBonusStats() {
    return $api.get<BonusStats>('/bonuses/stats');
  }
}

