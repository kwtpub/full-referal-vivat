import $api from '../http';
import type { AuthResponse } from '../models/response/AuthResponse';

export type InterestBoat = 'HardTop' | 'ClassicBoat' | 'Bowrider';
export type Status = 'Холодный' | 'Средний' | 'Горячий';
export type Stage = 'Закрыто' | 'Открыто' | 'Согласование';

// Цены на лодки (будут загружаться с сервера)
export type BoatPrices = Record<InterestBoat, number>;

export interface DealCreateData {
  interestBoat: InterestBoat;
  quantity: number;
  stage: Stage;
  status: Status;
}

export default class DealService {
  static async create(clientId: string, data: DealCreateData) {
    return $api.post<AuthResponse>(`/deal/${clientId}`, data);
  }

  static async delete(id: string) {
    return $api.delete<AuthResponse>(`/deal/${id}`);
  }

  static async update(id: string, data: DealCreateData) {
    return $api.patch<AuthResponse>(`/deal/${id}`, data);
  }

  static async getDeals() {
    return $api.get<AuthResponse>('/deals');
  }

  static async getDealsByClientId(clientId: string) {
    return $api.get<AuthResponse>(`/deals/client/${clientId}`);
  }

  static async getDealsByAgent(agentId: string) {
    return $api.get<AuthResponse>(`/deals/agent/${agentId}`);
  }

  static async getDealById(id: string) {
    return $api.get<AuthResponse>(`/deal/${id}`);
  }

  static async getBoatPrices() {
    return $api.get<BoatPrices>('/boats/prices');
  }

  static async approveDeal(id: string) {
    return $api.post<AuthResponse>(`/deal/${id}/approve`);
  }

  static async rejectDeal(id: string) {
    return $api.post<AuthResponse>(`/deal/${id}/reject`);
  }
}

