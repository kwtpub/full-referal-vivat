import $api from '../http';

export interface Agent {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  clientsCount?: number;
  salesCount?: number;
  totalBonuses?: number;
}

export interface TotalStats {
  totalClients: number;
  totalSales: number;
}

export interface UpdateAgentData {
  name: string;
  email: string;
  isActive: boolean;
}

export default class AgentService {
  static async getAgents() {
    return $api.get<Agent[]>('/agents');
  }

  static async getAgentsWithStats() {
    return $api.get<Agent[]>('/agents/stats');
  }

  static async getTotalStats() {
    return $api.get<TotalStats>('/agents/stats/total');
  }

  static async update(agentId: string, data: UpdateAgentData) {
    return $api.patch(`/agents/${agentId}`, data);
  }

  static async getAgentClients(agentId: string) {
    return $api.get(`/clients/${agentId}`);
  }

  static async delete(agentId: string) {
    return $api.delete(`/agents/${agentId}`);
  }
}

