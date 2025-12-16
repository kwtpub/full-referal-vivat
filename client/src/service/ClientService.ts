import $api from '../http';
import type { AuthResponse } from '../models/response/AuthResponse';

export default class ClientService {
  static async create(name: string, phone: string) {
    return $api.post<AuthResponse>('/client', { name, phone });
  }

  static async delete(id: string, phone: string) {
    return $api.delete<AuthResponse>(`/client/${id}`, {
      data: { phone },
    } as any);
  }

  static async deleteById(id: string) {
    return $api.delete<AuthResponse>(`/client/${id}/admin`);
  }

  static async update(id: string, name: string, phone: string) {
    return $api.patch<AuthResponse>(`/client/${id}`, { name, phone });
  }

  static async getClients() {
    return $api.get<AuthResponse>('/clients');
  }

  static async getClientsFromAgent(agentId: string) {
    return $api.get<AuthResponse>(`/clients/${agentId}`);
  }

  static async findByPhone(phone: string) {
    return $api.get<AuthResponse>('/client/find', { params: { phone } });
  }
}
