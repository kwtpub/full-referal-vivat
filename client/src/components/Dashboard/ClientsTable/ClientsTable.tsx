import { useState, useEffect, useContext } from 'react';
import DealService, { type Status, type Stage } from '../../../service/DealService';
import '../../../pages/Dashboard/Dashboard.css';
import './ClientsTable.css';
import DealMenuButton from './DealMenuButton';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import EditClientModal from './modals/EditClientModal';
import SortMenu, { type SortOption } from './menus/SortMenu';
import { useSortMenu } from './hooks/useSortMenu';
import { Context } from '../../../main';

export interface Deal {
  id: string;
  clientId: string;
  interestBoat: string;
  stage: Stage;
  status: Status;
  pendingApproval: boolean;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}

interface ClientsTableProps {
  onAddClientClick: () => void;
  refreshTrigger?: number;
  onDataChanged?: () => void; // Callback для уведомления Dashboard об изменении данных
}

const ClientsTable = ({ onAddClientClick, refreshTrigger, onDataChanged }: ClientsTableProps) => {
  const { store } = useContext(Context);
  const isAdmin = store?.user?.isAdmin || false;
  
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<{ id: string; clientName: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const sortMenu = useSortMenu();
  const { isOpen: isSortMenuOpen, position: sortMenuPosition, width: sortMenuWidth, buttonRef: sortButtonRef, toggleMenu: toggleSortMenu, closeMenu: closeSortMenu } = sortMenu;

  const fetchDeals = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await DealService.getDeals();
      const dealsData = (response.data as any) || [];
      setDeals(Array.isArray(dealsData) ? dealsData : []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка загрузки данных';
      setError(errorMessage);
      console.error('Ошибка загрузки сделок:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [refreshTrigger]);

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

  const formatBoatName = (interestBoat: string): string => {
    const boatName = getBoatName(interestBoat);
    if (boatName.length > 20) {
      return boatName.slice(0, 40);
    }
    return boatName;
  };

  const formatClientId = (id: string): string => {
    // Берем последние 5 символов ID для отображения
    return `#${id.slice(-5)}`;
  };

  const handleEdit = (deal: Deal) => {
    setDealToEdit(deal);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchDeals(); // Обновляем список после успешного редактирования
    onDataChanged?.(); // Уведомляем Dashboard для обновления статистики
  };

  const handleSort = (option: SortOption) => {
    const sortedDeals = [...deals];
    
    switch (option) {
      case 'name':
        sortedDeals.sort((a, b) => a.client.name.localeCompare(b.client.name));
        break;
      case 'status':
        const statusOrder: Record<Status, number> = { 'Горячий': 1, 'Средний': 2, 'Холодный': 3 };
        sortedDeals.sort((a, b) => (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0));
        break;
      case 'stage':
        const stageOrder: Record<Stage, number> = { 'Открыто': 1, 'Согласование': 2, 'Закрыто': 3 };
        sortedDeals.sort((a, b) => (stageOrder[a.stage] || 0) - (stageOrder[b.stage] || 0));
        break;
      case 'boat':
        sortedDeals.sort((a, b) => a.interestBoat.localeCompare(b.interestBoat));
        break;
      default:
        break;
    }
    
    setDeals(sortedDeals);
  };

  const handleDeleteClick = (dealId: string, clientName: string) => {
    setDealToDelete({ id: dealId, clientName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dealToDelete) return;

    try {
      await DealService.delete(dealToDelete.id);
      // Обновляем список после успешного удаления
      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealToDelete.id));
      setDealToDelete(null);
      onDataChanged?.(); // Уведомляем Dashboard для обновления статистики
    } catch (err: any) {
      console.error('Ошибка удаления сделки:', err);
      const errorMessage = err?.response?.data?.message || 'Ошибка при удалении сделки';
      alert(errorMessage);
    }
  };

  const handleApproveDeal = async (dealId: string) => {
    try {
      await DealService.approveDeal(dealId);
      // Обновляем список после подтверждения
      await fetchDeals();
      onDataChanged?.(); // Уведомляем Dashboard для обновления статистики
      alert('Продажа успешно подтверждена');
    } catch (err: any) {
      console.error('Ошибка подтверждения сделки:', err);
      const errorMessage = err?.response?.data?.message || 'Ошибка при подтверждении сделки';
      alert(errorMessage);
    }
  };

  const handleRejectDeal = async (dealId: string) => {
    try {
      await DealService.rejectDeal(dealId);
      // Обновляем список после отклонения
      await fetchDeals();
      onDataChanged?.(); // Уведомляем Dashboard для обновления статистики
      alert('Продажа отклонена и возвращена в статус "Открыто"');
    } catch (err: any) {
      console.error('Ошибка отклонения сделки:', err);
      const errorMessage = err?.response?.data?.message || 'Ошибка при отклонении сделки';
      alert(errorMessage);
    }
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
        <h2 className="dashboard-clients-title">Мои клиенты</h2>
        <div className="dashboard-clients-actions">
          <button className="dashboard-button-add" onClick={onAddClientClick}>
            Добавить клиента
          </button>
          <button 
            ref={sortButtonRef}
            className={`dashboard-button-sort ${isSortMenuOpen ? 'dashboard-button-sort-open' : ''}`}
            onClick={toggleSortMenu}
            type="button"
          >
            <span>Сортировка</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="dashboard-clients-table">
        <div className="dashboard-clients-table-header">
          <div className="dashboard-clients-table-col">НОМЕР</div>
          <div className="dashboard-clients-table-col">ИМЯ</div>
          <div className="dashboard-clients-table-col">СТАТУС</div>
          <div className="dashboard-clients-table-col">СТАТУС СДЕЛКИ</div>
          <div className="dashboard-clients-table-col">КАТЕР</div>
          <div className="dashboard-clients-table-col"></div>
        </div>

        {deals.length === 0 ? (
          <div className="dashboard-clients-empty">
            <p>Нет клиентов с заказами</p>
          </div>
        ) : (
          deals.map((deal) => (
            <div key={deal.id} className="dashboard-clients-table-row">
              <div className="dashboard-clients-table-cell" data-label="Номер">
                {formatClientId(deal.client.id)}
              </div>
              <div className="dashboard-clients-table-cell" data-label="Имя">{deal.client.name}</div>
              <div className="dashboard-clients-table-cell" data-label="Статус">{deal.status}</div>
              <div className="dashboard-clients-table-cell" data-label="Статус сделки">
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
              <div className="dashboard-clients-table-cell dashboard-clients-table-cell-boat" data-label="Катер">
                {formatBoatName(deal.interestBoat)}
              </div>
              <div className="dashboard-clients-table-cell" data-label="">
                <DealMenuButton
                  deal={deal}
                  onEdit={() => handleEdit(deal)}
                  onDelete={() => handleDeleteClick(deal.id, deal.client.name)}
                  isAdmin={isAdmin}
                  onApprove={() => handleApproveDeal(deal.id)}
                  onReject={() => handleRejectDeal(deal.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDealToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        clientName={dealToDelete?.clientName}
      />

      <EditClientModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setDealToEdit(null);
        }}
        onSuccess={handleEditSuccess}
        deal={dealToEdit}
      />

      <SortMenu
        isOpen={isSortMenuOpen}
        onClose={closeSortMenu}
        onSort={handleSort}
        position={sortMenuPosition}
        width={sortMenuWidth}
      />
    </div>
  );
};

export default ClientsTable;

