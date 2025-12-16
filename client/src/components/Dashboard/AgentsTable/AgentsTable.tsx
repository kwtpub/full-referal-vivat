import { useState, useEffect } from 'react';
import AgentService, { type Agent } from '../../../service/AgentService';
import '../../../pages/Dashboard/Dashboard.css';
import './AgentsTable.css';
import AgentClientsModal from './modals/AgentClientsModal';
import AgentMenuButton from './AgentMenuButton';
import DeleteConfirmModal from '../ClientsTable/modals/DeleteConfirmModal';
import EditAgentModal from './modals/EditAgentModal';

interface AgentsTableProps {
  refreshTrigger?: number;
}

const AgentsTable = ({ refreshTrigger }: AgentsTableProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await AgentService.getAgentsWithStats();
      const agentsData = response.data || [];
      // Фильтруем админов - показываем только агентов
      setAgents(Array.isArray(agentsData) ? agentsData.filter(a => !a.isAdmin) : []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка загрузки данных';
      setError(errorMessage);
      console.error('Ошибка загрузки агентов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [refreshTrigger]);

  const formatAgentId = (id: string): string => {
    return `#${id.slice(-5)}`;
  };

  const formatBonus = (bonus: number | undefined): string => {
    if (bonus === undefined || bonus === null) return '0 ₽';
    return `${Math.round(bonus).toLocaleString('ru-RU')} ₽`;
  };

  const handleViewClients = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsClientsModalOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setAgentToEdit(agent);
    setEditModalOpen(true);
  };

  const handleDelete = (agent: Agent) => {
    setAgentToDelete({ id: agent.id, name: agent.name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;
    
    try {
      await AgentService.delete(agentToDelete.id);
      // Обновляем список после успешного удаления
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentToDelete.id));
      setAgentToDelete(null); // Уведомляем Dashboard для обновления статистики
    } catch (err: any) {
      console.error('Ошибка удаления агента:', err);
      const errorMessage = err?.response?.data?.message || 'Ошибка при удалении агента';
      alert(errorMessage);
    }
  };

  const handleEditSuccess = () => {
    fetchAgents(); // Обновляем список после успешного редактирования
  };

  if (isLoading) {
    return (
      <div className="dashboard-clients">
        <div className="dashboard-clients-loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-clients">
        <div className="dashboard-clients-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-clients">
      <div className="dashboard-clients-header">
        <h2 className="dashboard-clients-title">Агенты</h2>
      </div>

      <div className="dashboard-clients-table agents-table">
        <div className="dashboard-clients-table-header agents-table-header">
          <div className="dashboard-clients-table-col">ИМЯ</div>
          <div className="dashboard-clients-table-col">КЛИЕНТЫ</div>
          <div className="dashboard-clients-table-col">ПРОДАЖИ</div>
          <div className="dashboard-clients-table-col">БОНУС</div>
          <div className="dashboard-clients-table-col"></div>
        </div>

        {agents.length === 0 ? (
          <div className="dashboard-clients-empty">
            <p>Нет зарегистрированных агентов</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="dashboard-clients-table-row agents-table-row">
              <div className="dashboard-clients-table-cell" data-label="Имя">
                <div className="agents-name-cell">
                  <span className="agents-name">{agent.name}</span>
                  <span className="agents-email">{agent.email}</span>
                </div>
              </div>
              <div className="dashboard-clients-table-cell" data-label="Клиенты">
                {agent.clientsCount || 0}
              </div>
              <div className="dashboard-clients-table-cell" data-label="Продажи">
                {agent.salesCount || 0}
              </div>
              <div className="dashboard-clients-table-cell" data-label="Бонус">
                {formatBonus(agent.totalBonuses)}
              </div>
              <div className="dashboard-clients-table-cell" data-label="">
                <AgentMenuButton
                  agent={agent}
                  onEdit={() => handleEdit(agent)}
                  onDelete={() => handleDelete(agent)}
                  onViewClients={() => handleViewClients(agent)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <AgentClientsModal
        isOpen={isClientsModalOpen}
        onClose={() => {
          setIsClientsModalOpen(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAgentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        clientName={agentToDelete?.name}
      />

      <EditAgentModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setAgentToEdit(null);
        }}
        onSuccess={handleEditSuccess}
        agent={agentToEdit}
      />
    </div>
  );
};

export default AgentsTable;

