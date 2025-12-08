import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  type?: 'text' | 'email' | 'password';
  showPasswordToggle?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  error?: string;
}

function Input({
  label,
  type = 'text',
  showPasswordToggle = false,
  iconLeft,
  iconRight,
  error,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
        <input
          type={inputType}
          className={`input ${isPassword ? 'input-password' : ''} ${error ? 'input-error-state' : ''} ${className}`.trim()}
          {...props}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 3C4.667 3 2.073 5.073 1 8c1.073 2.927 3.667 5 7 5s5.927-2.073 7-5c-1.073-2.927-3.667-5-7-5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <img src="/images/Private-view.svg" alt="Скрыть пароль" width="16" height="16" />
            )}
          </button>
        )}
        {iconRight && !isPassword && <span className="input-icon-right">{iconRight}</span>}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default Input;

