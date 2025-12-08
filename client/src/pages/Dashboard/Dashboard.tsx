import { useContext, useState, useEffect } from 'react';
import { Context } from '../../main';
import { ChartCard } from '../../components/ui';
import AddClientModal from '../../components/Dashboard/AddClientModal';
import ClientsTable from '../../components/Dashboard/ClientsTable';
import AgentsTable from '../../components/Dashboard/AgentsTable';
import PendingApprovalDeals from '../../components/Dashboard/PendingApprovalDeals';
import DashboardMobileMenu from '../../components/Dashboard/DashboardMobileMenu';
import DealService, { type Stage } from '../../service/DealService';
import BonusService, { type BonusStats } from '../../service/BonusService';
import AgentService, { type TotalStats } from '../../service/AgentService';
import './Dashboard.css';

interface Deal {
  id: string;
  clientId: string;
  interestBoat: string;
  stage: Stage;
  status: string;
  amount?: number | string | null;
  pendingApproval: boolean;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}

const Dashboard = () => {
  const { store } = useContext(Context);
  const userName = store.user.name || store.user.email || 'USER NAME';
  const isAdmin = store.user.isAdmin || false;
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clientsRefreshTrigger, setClientsRefreshTrigger] = useState(0);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bonusStats, setBonusStats] = useState<BonusStats | null>(null);
  const [agentsCount, setAgentsCount] = useState(0);
  const [totalStats, setTotalStats] = useState<TotalStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          // Для админа загружаем статистику по всем агентам
          const agentsResponse = await AgentService.getAgents();
          const agents = agentsResponse.data || [];
          setAgentsCount(agents.filter(a => !a.isAdmin).length);
          
          // Загружаем общую статистику
          const totalStatsResponse = await AgentService.getTotalStats();
          setTotalStats(totalStatsResponse.data || null);
        } else {
          // Для агента загружаем его сделки
          const response = await DealService.getDeals();
          const dealsData = (response.data as any) || [];
          const dealsArray = Array.isArray(dealsData) ? dealsData : [];
          setDeals(dealsArray);

          // Загружаем статистику бонусов
          const bonusResponse = await BonusService.getBonusStats();
          setBonusStats(bonusResponse.data as unknown as BonusStats);
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setDeals([]);
      }
    };

    fetchData();
  }, [clientsRefreshTrigger, isAdmin]);

  // Вычисляем реальную статистику
  // Количество уникальных клиентов из сделок
  const uniqueClientIds = new Set(deals.map((deal) => deal.clientId));
  const clientsCount = uniqueClientIds.size;
  // Считаем только подтвержденные продажи (закрыто И не ожидает подтверждения)
  const salesCount = deals.filter((deal) => deal.stage === 'Закрыто' && !deal.pendingApproval).length;

  // Генерируем данные для графиков (последние 6 дней)
  const generateChartData = (values: number[]) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return values.map((value, index) => ({
      date: now - (values.length - 1 - index) * oneDay,
      value,
    }));
  };

  // Данные из статистики бонусов
  const currentPercent = bonusStats?.currentPercent || 3;
  const totalBonuses = bonusStats?.totalBonuses || 0;
  const nextTierInfo = bonusStats?.nextTier;

  // Карточки статистики для админа
  const totalClients = totalStats?.totalClients || 0;
  const totalSales = totalStats?.totalSales || 0;
  
  const adminStatsCards = [
    {
      title: 'Агенты',
      value: agentsCount.toString(),
      change: 'всего',
      changeType: 'positive' as const,
      changeLabel: 'зарегистрировано',
      chartData: generateChartData([
        Math.max(0, agentsCount - 5),
        Math.max(0, agentsCount - 3),
        Math.max(0, agentsCount - 4),
        Math.max(0, agentsCount - 2),
        Math.max(0, agentsCount - 1),
        agentsCount,
      ]),
    },
    {
      title: 'Клиенты',
      value: totalClients.toString(),
      change: 'всего',
      changeType: 'positive' as const,
      changeLabel: 'уникальных',
      chartData: generateChartData([
        Math.max(0, totalClients - 5),
        Math.max(0, totalClients - 3),
        Math.max(0, totalClients - 4),
        Math.max(0, totalClients - 2),
        Math.max(0, totalClients - 1),
        totalClients,
      ]),
    },
    {
      title: 'Продажи',
      value: totalSales.toString(),
      change: 'всего',
      changeType: 'positive' as const,
      changeLabel: 'закрыто сделок',
      chartData: generateChartData([
        Math.max(0, totalSales - 5),
        Math.max(0, totalSales - 3),
        Math.max(0, totalSales - 4),
        Math.max(0, totalSales - 2),
        Math.max(0, totalSales - 1),
        totalSales,
      ]),
    },
  ];

  // Карточки статистики для агента
  const agentStatsCards = [
    {
      title: 'Клиенты',
      value: clientsCount.toString(),
      change: `${currentPercent}%`,
      changeType: 'positive' as const,
      changeLabel: 'ваш процент',
      chartData: generateChartData([
        Math.max(0, clientsCount - 5),
        Math.max(0, clientsCount - 3),
        Math.max(0, clientsCount - 4),
        Math.max(0, clientsCount - 2),
        Math.max(0, clientsCount - 1),
        clientsCount,
      ]),
    },
    {
      title: 'Продажи',
      value: salesCount.toString(),
      change: nextTierInfo ? `ещё ${nextTierInfo.salesNeeded}` : 'макс',
      changeType: 'positive' as const,
      changeLabel: nextTierInfo ? `до ${nextTierInfo.nextPercent}%` : 'уровень',
      chartData: generateChartData([
        Math.max(0, salesCount - 5),
        Math.max(0, salesCount - 3),
        Math.max(0, salesCount - 4),
        Math.max(0, salesCount - 2),
        Math.max(0, salesCount - 1),
        salesCount,
      ]),
    },
    {
      title: 'Бонусы',
      value: `${Math.round(totalBonuses).toLocaleString('ru-RU')} ₽`,
      change: `${currentPercent}%`,
      changeType: 'positive' as const,
      changeLabel: 'комиссия',
      chartData: generateChartData([
        Math.max(0, totalBonuses * 0.6),
        Math.max(0, totalBonuses * 0.7),
        Math.max(0, totalBonuses * 0.65),
        Math.max(0, totalBonuses * 0.85),
        Math.max(0, totalBonuses * 0.9),
        totalBonuses,
      ]),
    },
  ];

  const statsCards = isAdmin ? adminStatsCards : agentStatsCards;


  return (
    <div className="dashboard-page">
      <div className="dashboard-background" />
      
      <button 
        className="dashboard-burger-menu" 
        aria-label="Меню"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <img src="/images/close-icon.svg" alt="Close" />
        ) : (
          <img src="/images/burger-menu.svg" alt="Menu" />
        )}
      </button>

      <div className="dashboard-header">
        <div className="dashboard-logo">
          <img src="/images/logo-01.png" alt="Vivat Logo" className="dashboard-logo-desktop" />
          <img src="/images/logo-03.svg" alt="Vivat Logo" className="dashboard-logo-mobile" />
        </div>
        <div className="dashboard-user-info">
          <span className="dashboard-user-name">{userName}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <img 
          src="/images/drive-maney.svg" 
          alt="" 
          className="dashboard-decorative-image" 
        />
        <h1 className="dashboard-title">DASHBOARD</h1>

        <div className="dashboard-stats">
          {statsCards.map((card, index) => (
            <div key={index} className="dashboard-stat-card">
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-title">{card.title}</span>
                <span className="dashboard-stat-value">{card.value}</span>
                <div className="dashboard-stat-change">
                  <div className={`dashboard-stat-badge dashboard-stat-badge-${card.changeType}`}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L9 15M9 3L3 9M9 3L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{card.change}</span>
                  </div>
                  <span className="dashboard-stat-label">{card.changeLabel}</span>
                </div>
              </div>
              <div className="dashboard-stat-chart">
                <ChartCard data={card.chartData} label={card.title} />
              </div>
            </div>
          ))}
        </div>

        {!isAdmin && (
          <div className="dashboard-progress">
            <div className="dashboard-progress-content">
              <h2 className="dashboard-progress-title">
                {nextTierInfo 
                  ? `Прогресс до ${nextTierInfo.nextPercent}% комиссии`
                  : 'Максимальный уровень достигнут!'
                }
              </h2>
              <div className="dashboard-progress-bar">
                <div 
                  className="dashboard-progress-fill" 
                  style={{
                    width: nextTierInfo 
                      ? `${Math.min(((salesCount) / (salesCount + nextTierInfo.salesNeeded)) * 100, 100)}%`
                      : '100%'
                  }} 
                />
              </div>
              <span className="dashboard-progress-label">
                {nextTierInfo 
                  ? `${salesCount} продаж (ещё ${nextTierInfo.salesNeeded} до ${nextTierInfo.nextPercent}%)`
                  : `${salesCount} продаж • 8% комиссия`
                }
              </span>
            </div>
          </div>
        )}

        {isAdmin ? (
          <>
            <PendingApprovalDeals
              refreshTrigger={clientsRefreshTrigger}
              onDataChanged={() => setClientsRefreshTrigger((prev) => prev + 1)}
            />
            <AgentsTable refreshTrigger={clientsRefreshTrigger} />
          </>
        ) : (
          <ClientsTable
            onAddClientClick={() => setIsAddClientModalOpen(true)}
            refreshTrigger={clientsRefreshTrigger}
            onDataChanged={() => setClientsRefreshTrigger((prev) => prev + 1)}
          />
        )}
      </div>

      {!isAdmin && (
        <AddClientModal
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
          onSuccess={() => {
            // Обновляем список клиентов после успешного создания
            setClientsRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}

      <DashboardMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={() => store.logout()}
      />
    </div>
  );
};

export default Dashboard;
