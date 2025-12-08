import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'medium' | 'small';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

function Button({
  variant = 'primary',
  size = 'large',
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const buttonClass = `button button-${variant} button-${size} ${fullWidth ? 'button-full-width' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim();

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {iconLeft && <span className="button-icon-left">{iconLeft}</span>}
      {children && <span className="button-text">{children}</span>}
      {iconRight && <span className="button-icon-right">{iconRight}</span>}
    </button>
  );
}

export default Button;

