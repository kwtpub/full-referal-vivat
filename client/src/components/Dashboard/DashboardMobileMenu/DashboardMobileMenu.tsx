import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardMobileMenu.css';

interface DashboardMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void | Promise<void>;
}

const DashboardMobileMenu = ({ isOpen, onClose, onLogout }: DashboardMobileMenuProps) => {
  const navigate = useNavigate();

  const handleNavClick = (path?: string) => {
    onClose();
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    onClose();
    await onLogout();
    navigate('/login');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={`dashboard-mobile-menu ${isOpen ? 'dashboard-mobile-menu-open' : ''}`}>
      <div className="dashboard-mobile-menu-overlay" onClick={onClose}></div>
      <div className="dashboard-mobile-menu-content">
        <nav className="dashboard-mobile-menu-nav">
          <button 
            onClick={() => handleNavClick('/')} 
            className="dashboard-mobile-menu-link"
          >
            Главная
          </button>
          <button 
            onClick={handleLogout} 
            className="dashboard-mobile-menu-link"
          >
            Выход
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardMobileMenu;

