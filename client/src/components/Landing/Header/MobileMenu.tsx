import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const MobileMenu = ({ isOpen, onClose, onRegisterClick }: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleNavClick = (path?: string) => {
    onClose();
    if (path) {
      navigate(path);
    }
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

  if (!isOpen) return null;

  return createPortal(
    <div className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}>
      <div className="mobile-menu-overlay" onClick={onClose}></div>
      <button 
        className="mobile-menu-close-button"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <img 
          src="/images/close-icon.svg" 
          alt="Close" 
          className="mobile-menu-close-icon"
        />
      </button>
      <div className="mobile-menu-content">
        <nav className="mobile-menu-nav">
          <button 
            onClick={() => handleNavClick('/login')} 
            className="mobile-menu-link"
          >
            Вход
          </button>
          <a 
            href="#about" 
            className="mobile-menu-link"
            onClick={() => handleNavClick()}
          >
            О нас
          </a>
          <a 
            href="#contacts" 
            className="mobile-menu-link"
            onClick={() => handleNavClick()}
          >
            Контакты
          </a>
        </nav>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu;

