import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton, Button, Input } from '../../ui';
import './RegistrationForm.css';

export interface RegistrationFormStep1Props {
  onBack?: () => void;
  onNext: (data: { firstName: string; lastName: string }) => void;
  onSwitchToLogin?: () => void;
  initialData?: { firstName: string; lastName: string };
}

const RegistrationFormStep1 = ({ onBack, onNext, onSwitchToLogin, initialData }: RegistrationFormStep1Props) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>(initialData?.firstName || '');
  const [lastName, setLastName] = useState<string>(initialData?.lastName || '');
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  const validateFirstName = (value: string): string | undefined => {
    if (!value) {
      return 'Обязательное поле';
    }
    return undefined;
  };

  const validateLastName = (value: string): string | undefined => {
    if (!value) {
      return 'Обязательное поле';
    }
    return undefined;
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (errors.firstName) {
      setErrors((prev) => ({ ...prev, firstName: validateFirstName(value) }));
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (errors.lastName) {
      setErrors((prev) => ({ ...prev, lastName: validateLastName(value) }));
    }
  };

  const handleBlur = (field: 'firstName' | 'lastName') => {
    if (field === 'firstName') {
      setErrors((prev) => ({ ...prev, firstName: validateFirstName(firstName) }));
    } else if (field === 'lastName') {
      setErrors((prev) => ({ ...prev, lastName: validateLastName(lastName) }));
    }
  };

  const handleNext = () => {
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
    });

    if (!firstNameError && !lastNameError) {
      onNext({ firstName, lastName });
    }
  };

  const isButtonDisabled = !firstName || !lastName;

  return (
    <div className="registration-page">
      <div className="registration-container">
        <header className="registration-header">
          <BackButton onClick={() => navigate('/')} />
          <img src="/images/logo-01.png" alt="Vivat Logo" className="registration-logo registration-logo-desktop" />
          <img src="/images/logo-03 1.png" alt="Vivat Logo" className="registration-logo registration-logo-mobile" />
        </header>

        <h1 className="registration-title">
          <span className="registration-title-desktop">РЕГИСТРАЦИЯ</span>
          <span className="registration-title-mobile">Регистрация</span>
        </h1>

        <div className="registration-form">
          <Input
            label="Имя"
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={handleFirstNameChange}
            onBlur={() => handleBlur('firstName')}
            error={errors.firstName}
          />

          <Input
            label="Отчество"
            type="text"
            placeholder="Отчество"
            value={lastName}
            onChange={handleLastNameChange}
            onBlur={() => handleBlur('lastName')}
            error={errors.lastName}
          />
        </div>

        <div className="registration-bottom">
          <div className="registration-switch-text">
            <span className="registration-switch-text-normal">У вас уже есть аккаунт? </span>
            <button className="registration-switch-link" onClick={onSwitchToLogin}>
              Войти
            </button>
          </div>

          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            disabled={isButtonDisabled}
            className="registration-submit-button"
            fullWidth
          >
            Далее
          </Button>

          <p className="registration-agreement-text">
            Продолжая регистрацию, вы соглашаетесь с Пользовательским соглашением, Политикой
            конфиденциальности, Политикой возвратов и даёте Согласие на обработку персональных данных
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormStep1;

