import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import './MainPage.css';

interface MainPageProps {
  userName: string;
  onLogout: () => void;
}

const MainPage = ({ userName, onLogout }: MainPageProps) => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="main-page">
      <div className="main-page-container">
        <img src="/images/logo-01.png" alt="Vivat Logo" className="main-page-logo main-page-logo-desktop" />
        <img src="/images/logo-03 1.png" alt="Vivat Logo" className="main-page-logo main-page-logo-mobile" />

        <div className="main-page-blur-effect" />

        <div className="main-page-content">
          <h1 className="main-page-title">
            <span className="main-page-title-desktop">поздравляем!</span>
            <span className="main-page-title-mobile">Поздравляем!</span>
          </h1>

          <p className="main-page-subtitle">Вы успешно прошли регистрацию</p>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={handleStart}
          className="main-page-button"
          fullWidth
        >
          Начать
        </Button>
      </div>
    </div>
  );
};

export default MainPage;

