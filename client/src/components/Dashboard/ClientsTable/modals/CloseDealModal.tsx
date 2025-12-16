import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './CloseDealModal.css';

interface CloseDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  clientName?: string;
}

const CloseDealModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  clientName 
}: CloseDealModalProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError('');
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || amount.trim() === '') {
      setError('Введите сумму сделки');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Сумма должна быть больше 0');
      return;
    }

    onConfirm(numAmount);
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры и одну точку
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  return createPortal(
    <div className="close-deal-modal" onClick={handleOverlayClick}>
      <div className="close-deal-modal-overlay" />
      <div className="close-deal-modal-content">
        <h2 className="close-deal-modal-title">Закрыть сделку</h2>
        {clientName && (
          <p className="close-deal-modal-text">Клиент: {clientName}</p>
        )}
        <div className="close-deal-modal-input-group">
          <label htmlFor="deal-amount" className="close-deal-modal-label">
            Сумма сделки (₽)
          </label>
          <input
            id="deal-amount"
            type="text"
            className="close-deal-modal-input"
            placeholder="Введите сумму"
            value={amount}
            onChange={handleAmountChange}
            autoFocus
          />
          {error && <span className="close-deal-modal-error">{error}</span>}
        </div>
        <div className="close-deal-modal-actions">
          <button
            className="close-deal-modal-button close-deal-modal-button-cancel"
            onClick={onClose}
            type="button"
          >
            Отмена
          </button>
          <button
            className="close-deal-modal-button close-deal-modal-button-confirm"
            onClick={handleConfirm}
            type="button"
          >
            Закрыть сделку
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CloseDealModal;
