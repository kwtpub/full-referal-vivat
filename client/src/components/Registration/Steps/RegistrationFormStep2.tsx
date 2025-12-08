import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton, Button, Input } from '../../ui';
import './RegistrationForm.css';

export interface RegistrationFormStep2Props {
  onBack: () => void;
  onSubmit: (data: { email: string; password: string }) => void;
  onSwitchToLogin?: () => void;
  serverError?: string;
  initialData?: { email: string; password: string; confirmPassword: string };
}

const RegistrationFormStep2 = ({ onBack, onSubmit, onSwitchToLogin, serverError, initialData }: RegistrationFormStep2Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const [password, setPassword] = useState<string>(initialData?.password || '');
  const [confirmPassword, setConfirmPassword] = useState<string>(initialData?.confirmPassword || '');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return 'Обязательное поле';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Некорректный email';
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Обязательное поле';
    }
    if (value.length < 8) {
      return 'Слишком короткий';
    }
    return undefined;
  };

  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value) {
      return 'Обязательное поле';
    }
    if (value !== password) {
      return 'Пароли не совпадают';
    }
    return undefined;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
    if (errors.confirmPassword && confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
    }
  };

  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    } else if (field === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  };

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (!emailError && !passwordError && !confirmPasswordError) {
      onSubmit({ email, password });
    }
  };

  const isButtonDisabled = !email || !password || !confirmPassword || password !== confirmPassword;

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
            label="Электронная почта"
            type="email"
            placeholder="example@provider.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
            error={errors.email}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            showPasswordToggle
            error={errors.password}
          />

          <Input
            label="Повторите пароль"
            type="password"
            placeholder="Пароль"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => handleBlur('confirmPassword')}
            showPasswordToggle
            error={errors.confirmPassword}
          />
        </div>

        {serverError && <div className="registration-server-error">{serverError}</div>}

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
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="registration-submit-button"
            fullWidth
          >
            Зарегистрироваться
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

export default RegistrationFormStep2;

