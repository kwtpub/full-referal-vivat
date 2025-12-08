import { useEffect, useState } from 'react';
import './RegistrationLoader.css';

const RegistrationLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="registration-loader-page">
      <div className="registration-loader-container">
        <img src="/images/logo-01.png" alt="Vivat Logo" className="registration-loader-logo registration-loader-logo-desktop" />
        <img src="/images/logo-03 1.png" alt="Vivat Logo" className="registration-loader-logo registration-loader-logo-mobile" />

        <div className="registration-loader-content">
          <h1 className="registration-loader-title">
            <span className="registration-loader-title-desktop">ОДНУ МИНУТУ!</span>
            <span className="registration-loader-title-mobile">Одну минуту!</span>
          </h1>

          <p className="registration-loader-subtitle">Проверяем ваши данные</p>

          <div className="registration-loader-progress-container">
            <div className="registration-loader-progress-bg">
              <div 
                className="registration-loader-progress-bar" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="registration-loader-percentage">{progress}%</span>
          </div>
        </div>

        <p className="registration-loader-agreement">
          Продолжая регистрацию, вы соглашаетесь с Пользовательским соглашением, Политикой
          конфиденциальности, Политикой возвратов и даёте Согласие на обработку персональных данных
        </p>
      </div>
    </div>
  );
};

export default RegistrationLoader;

