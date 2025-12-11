import $api from '../http';
import type { AuthResponse } from '../models/response/AuthResponse';

export type Status = 'Холодный' | 'Средний' | 'Горячий';
export type Stage = 'Закрыто' | 'Открыто' | 'Согласование';

export interface DealCreateData {
  interestBoat: string;
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

  static async approveDeal(id: string) {
    return $api.post<AuthResponse>(`/deal/${id}/approve`);
  }

  static async rejectDeal(id: string) {
    return $api.post<AuthResponse>(`/deal/${id}/reject`);
  }
}

