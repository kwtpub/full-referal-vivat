import type { ButtonHTMLAttributes } from 'react';
import Button from '../Button';
import './BackButton.css';

export interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

function BackButton({ onClick, className = '', ...props }: BackButtonProps) {
  return (
    <Button
      variant="secondary"
      size="small"
      onClick={onClick}
      className={`back-button ${className}`.trim()}
      {...props}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}

export default BackButton;

