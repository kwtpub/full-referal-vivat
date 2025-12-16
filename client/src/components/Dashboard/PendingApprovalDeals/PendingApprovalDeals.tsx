import { useState, useEffect } from 'react';
import DealService, { type Status, type Stage } from '../../../service/DealService';
import CloseDealModal from '../ClientsTable/modals/CloseDealModal';
import './PendingApprovalDeals.css';

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
  agent?: {
    id: string;
    name: string;
    email: string;
  };
}

interface PendingApprovalDealsProps {
  refreshTrigger?: number;
  onDataChanged?: () => void;
}

const PendingApprovalDeals = ({ refreshTrigger, onDataChanged }: PendingApprovalDealsProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [closeDealModalOpen, setCloseDealModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const fetchPendingDeals = async () => {
    setIsLoading(true);
    try {
      const response = await DealService.getDeals();
      const dealsData = (response.data as any) || [];
      const allDeals = Array.isArray(dealsData) ? dealsData : [];
      console.log('All deals for admin:', allDeals);
      // Фильтруем только ожидающие подтверждения
      const pending = allDeals.filter((deal: Deal) => deal.pendingApproval);
      console.log('Pending approval deals:', pending);
      setDeals(pending);
    } catch (err: any) {
      console.error('Ошибка загрузки сделок:', err);
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeals();
  }, [refreshTrigger]);

  const handleApprove = async (deal: Deal) => {
    // Если у сделки нет суммы, запрашиваем её через модальное окно
    if (!deal.amount || Number(deal.amount) === 0) {
      setSelectedDeal(deal);
      setCloseDealModalOpen(true);
      return;
    }

    // Если сумма уже есть, подтверждаем сделку
    await approveDealDirectly(deal.id);
  };

  const approveDealDirectly = async (dealId: string) => {
    try {
      await DealService.approveDeal(dealId);
      fetchPendingDeals();
      onDataChanged?.();
      alert('Продажа успешно подтверждена');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка подтверждения';
      alert(errorMessage);
      console.error('Ошибка подтверждения сделки:', err);
    }
  };

  const handleCloseDealConfirm = async (amount: number) => {
    if (!selectedDeal) return;

    try {
      // Обновляем сделку с суммой
      await DealService.update(selectedDeal.id, {
        interestBoat: selectedDeal.interestBoat,
        quantity: 1,
        stage: selectedDeal.stage,
        status: selectedDeal.status,
        amount,
      });

      // Теперь подтверждаем сделку
      await approveDealDirectly(selectedDeal.id);
      setSelectedDeal(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка обновления суммы';
      alert(errorMessage);
      console.error('Ошибка обновления суммы сделки:', err);
    }
  };

  const handleReject = async (dealId: string) => {
    try {
      await DealService.rejectDeal(dealId);
      fetchPendingDeals();
      onDataChanged?.();
      alert('Продажа отклонена и возвращена в статус "Открыто"');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Ошибка отклонения';
      alert(errorMessage);
      console.error('Ошибка отклонения сделки:', err);
    }
  };

  const getBoatName = (interestBoat: string): string => {
    const boatNames: Record<string, string> = {
      HardTop: 'Hard Top 650 HT',
      ClassicBoat: 'Classic Boat 640 CB',
      Bowrider: 'Bowrider 680 BR',
    };
    return boatNames[interestBoat] || interestBoat;
  };

  if (isLoading) {
    return null;
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <div className="pending-approval-section">
      <h3 className="pending-approval-title">Ожидают подтверждения ({deals.length})</h3>
      <div className="pending-approval-list">
        {deals.map((deal) => (
          <div key={deal.id} className="pending-approval-item">
            <div className="pending-approval-item-info">
              <div className="pending-approval-item-main">
                <span className="pending-approval-client-name">{deal.client.name}</span>
                <span className="pending-approval-client-phone">{deal.client.phone}</span>
              </div>
              <div className="pending-approval-item-details">
                <span className="pending-approval-boat">{getBoatName(deal.interestBoat)}</span>
                <span className="pending-approval-status">Статус: {deal.status}</span>
              </div>
            </div>
            <div className="pending-approval-item-actions">
              <button
                type="button"
                className="pending-approval-btn pending-approval-btn-reject"
                onClick={() => handleReject(deal.id)}
              >
                Отклонить
              </button>
              <button
                type="button"
                className="pending-approval-btn pending-approval-btn-approve"
                onClick={() => handleApprove(deal)}
              >
                Подтвердить
              </button>
            </div>
          </div>
        ))}
      </div>
      <CloseDealModal
        isOpen={closeDealModalOpen}
        onClose={() => {
          setCloseDealModalOpen(false);
          setSelectedDeal(null);
        }}
        onConfirm={handleCloseDealConfirm}
        clientName={selectedDeal?.client.name}
      />
    </div>
  );
};

export default PendingApprovalDeals;

