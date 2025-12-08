import { Button } from '../../ui';
import './RegistrationSuccess.css';

interface RegistrationSuccessProps {
  onStart: () => void;
}

const RegistrationSuccess = ({ onStart }: RegistrationSuccessProps) => {
  return (
    <div className="registration-success-page">
      <div className="registration-success-container">
        <img src="/images/logo-01.png" alt="Vivat Logo" className="registration-success-logo registration-success-logo-desktop" />
        <img src="/images/logo-03 1.png" alt="Vivat Logo" className="registration-success-logo registration-success-logo-mobile" />

        <div className="registration-success-content">
          <h1 className="registration-success-title">
            <span className="registration-success-title-desktop">поздравляем!</span>
            <span className="registration-success-title-mobile">Поздравляем!</span>
          </h1>

          <p className="registration-success-subtitle">Вы успешно прошли регистрацию</p>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={onStart}
          className="registration-success-button"
          fullWidth
        >
          Начать
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;

