import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import type { Agent } from '../../../../service/AgentService';
import DealService, { type Status, type Stage } from '../../../../service/DealService';
import ClientService from '../../../../service/ClientService';
import EditClientModal from '../../ClientsTable/modals/EditClientModal';
import DeleteConfirmModal from '../../ClientsTable/modals/DeleteConfirmModal';
import { Context } from '../../../../main';
import './AgentClientsModal.css';

export interface Deal {
  id: string;
  clientId: string;
  interestBoat: string;
  stage: Stage;
  status: Status;
  pendingApproval: boolean;
  amount?: number | string | null;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}

interface AgentClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

const AgentClientsModal = ({ isOpen, onClose, agent }: AgentClientsModalProps) => {
  const { store } = useContext(Context);
  const isAdmin = store?.user?.isAdmin || false;
  
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isOpen && agent) {
      fetchAgentDeals();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDeals([]);
      setError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, agent]);

  const fetchAgentDeals = async () => {
    if (!agent) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await DealService.getDealsByAgent(agent.id);
      const dealsData = (response.data as any) || [];
      setDeals(Array.isArray(dealsData) ? dealsData : []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка загрузки клиентов';
      setError(errorMessage);
      console.error('Ошибка загрузки клиентов агента:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStageType = (stage: string): 'payment' | 'closed' | 'negotiation' => {
    if (stage === 'Оплата' || stage === 'Открыто') return 'payment';
    if (stage === 'Закрыто') return 'closed';
    if (stage === 'Согласование') return 'negotiation';
    return 'negotiation';
  };

  const getBoatName = (interestBoat: string): string => {
    const boatNames: Record<string, string> = {
      HardTop: 'Hard Top 650 HT',
      ClassicBoat: 'Classic Boat 640 CB',
      Bowrider: 'Bowrider 680 BR',
    };
    return boatNames[interestBoat] || interestBoat;
  };

  const formatClientId = (id: string): string => {
    return `#${id.slice(-5)}`;
  };

  const handleEdit = (deal: Deal) => {
    setDealToEdit(deal);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchAgentDeals();
  };

  const handleDeleteClick = (deal: Deal) => {
    setClientToDelete({ id: deal.client.id, name: deal.client.name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      await ClientService.deleteById(clientToDelete.id);
      setDeals(prevDeals => prevDeals.filter(deal => deal.client.id !== clientToDelete.id));
      setClientToDelete(null);
    } catch (err: any) {
      console.error('Ошибка удаления клиента:', err);
      const errorMessage = err?.response?.data?.message || 'Ошибка при удалении клиента';
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="agent-clients-modal">
      <div className="agent-clients-modal-overlay" onClick={onClose} />
      <div className="agent-clients-modal-content">
        <div className="agent-clients-modal-header">
          <h2 className="agent-clients-modal-title">
            Клиенты агента: {agent?.name}
          </h2>
          <button
            className="agent-clients-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="agent-clients-modal-body">
          {isLoading ? (
            <div className="agent-clients-modal-loading">Загрузка...</div>
          ) : error ? (
            <div className="agent-clients-modal-error">{error}</div>
          ) : deals.length === 0 ? (
            <div className="agent-clients-modal-empty">
              <p>У агента пока нет клиентов</p>
            </div>
          ) : (
            <div className="agent-clients-table-wrapper">
              <div className="agent-clients-table">
                <div className="agent-clients-table-header">
                  <div className="agent-clients-table-col">НОМЕР</div>
                  <div className="agent-clients-table-col">ИМЯ</div>
                  <div className="agent-clients-table-col">ТЕЛЕФОН</div>
                  <div className="agent-clients-table-col">СТАТУС</div>
                  <div className="agent-clients-table-col">ЭТАП</div>
                  <div className="agent-clients-table-col">КАТЕР</div>
                  <div className="agent-clients-table-col"></div>
                </div>

                {deals.map((deal) => (
                  <div key={deal.id} className="agent-clients-table-row">
                    <div className="agent-clients-table-cell" data-label="Номер">
                      {formatClientId(deal.client.id)}
                    </div>
                    <div className="agent-clients-table-cell" data-label="Имя">
                      {deal.client.name}
                    </div>
                    <div className="agent-clients-table-cell" data-label="Телефон">
                      {deal.client.phone}
                    </div>
                    <div className="agent-clients-table-cell" data-label="Статус">
                      {deal.status}
                    </div>
                    <div className="agent-clients-table-cell" data-label="Этап">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`dashboard-stage-badge dashboard-stage-badge-${getStageType(deal.stage)}`}>
                          {deal.stage}
                        </span>
                        {deal.pendingApproval && (
                          <img 
                            src="/images/clock-pending.svg" 
                            alt="Ожидает подтверждения" 
                            title="Ожидает подтверждения администратора"
                            style={{ width: '20px', height: '20px' }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="agent-clients-table-cell" data-label="Катер">
                      {getBoatName(deal.interestBoat)}
                    </div>
                    <div className="agent-clients-table-cell agent-clients-table-cell-actions">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="agent-clients-edit-btn"
                          onClick={() => handleEdit(deal)}
                          title="Редактировать"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.875 1.87499C14.1734 1.57662 14.578 1.40901 15 1.40901C15.422 1.40901 15.8266 1.57662 16.125 1.87499C16.4234 2.17336 16.591 2.57802 16.591 2.99999C16.591 3.42196 16.4234 3.82662 16.125 4.12499L9 11.25L6 12L6.75 8.99999L13.875 1.87499Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {isAdmin && (
                          <button 
                            className="agent-clients-edit-btn"
                            onClick={() => handleDeleteClick(deal)}
                            title="Удалить клиента"
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 4.5H15M6.75 4.5V3C6.75 2.60218 6.90804 2.22064 7.18934 1.93934C7.47064 1.65804 7.85218 1.5 8.25 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V4.5M13.5 4.5V15C13.5 15.3978 13.342 15.7794 13.0607 16.0607C12.7794 16.342 12.3978 16.5 12 16.5H6C5.60218 16.5 5.22064 16.342 4.93934 16.0607C4.65804 15.7794 4.5 15.3978 4.5 15V4.5H13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7.5 8.25V12.75M10.5 8.25V12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <EditClientModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setDealToEdit(null);
          }}
          onSuccess={handleEditSuccess}
          deal={dealToEdit}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setClientToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          clientName={clientToDelete?.name}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AgentClientsModal;

