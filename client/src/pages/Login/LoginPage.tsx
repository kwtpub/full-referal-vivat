import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import { BackButton, Button, Input } from '../../components/ui';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState<string>('');
  const { store } = useContext(Context);
  const navigate = useNavigate();

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
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      try {
        setServerError('');
        await store.login(email, password);
        navigate('/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Ошибка входа';
        setServerError(message);
      }
    }
  };

  const isButtonDisabled = !email || !password;

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <BackButton onClick={() => navigate('/')} />
          <img src="/images/logo-01.png" alt="Vivat Logo" className="login-logo login-logo-desktop" />
          <img src="/images/logo-03 1.png" alt="Vivat Logo" className="login-logo login-logo-mobile" />
        </header>

        <h1 className="login-title">
          <span className="login-title-desktop">ВХОД В АКАУНТ</span>
          <span className="login-title-mobile">Вход в аккаунт</span>
        </h1>

        <div className="login-form">
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
        </div>

        <div className="login-bottom">
          {serverError && <div className="login-server-error">{serverError}</div>}
          
          <div className="login-switch-text">
            <span className="login-switch-text-normal">У вас нет аккаунта? </span>
            <button className="login-switch-link" onClick={() => navigate('/registration')}>
              Зарегистрироваться
            </button>
          </div>

          <Button
            variant="primary"
            size="large"
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className="login-submit-button"
            fullWidth
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginPage);

