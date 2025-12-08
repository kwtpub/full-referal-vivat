import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import MobileMenu from './MobileMenu';
import './Header.css';

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header = ({ onRegisterClick }: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="landing-header">
      <div className="landing-header-container">
        <div className="landing-header-spacer"></div>
        
        <img src="/images/logo-01.png" alt="Vivat Logo" className="landing-header-logo" />
        
        <nav className="landing-header-nav">
          <a href="#about" className="landing-header-nav-link">О нас</a>
          <button onClick={() => navigate('/dashboard')} className="landing-header-nav-link">Dashboard</button>
          <a href="#contacts" className="landing-header-nav-link">Контакты</a>
        </nav>

        <Button
          variant="primary"
          size="medium"
          onClick={onRegisterClick}
          className="landing-header-button"
        >
          Регистрация
        </Button>

        <button 
          className="landing-header-burger"
          aria-label="Меню"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <img 
              src="/images/close-icon.svg" 
              alt="Close" 
              className="landing-header-burger-icon"
            />
          ) : (
            <img 
              src="/images/burger-menu.svg" 
              alt="Menu" 
              className="landing-header-burger-icon"
            />
          )}
        </button>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onRegisterClick={onRegisterClick}
      />
    </header>
  );
};

export default Header;

