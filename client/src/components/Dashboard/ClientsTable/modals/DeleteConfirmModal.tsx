import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName?: string;
}

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  clientName 
}: DeleteConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

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
    onConfirm();
    onClose();
  };

  return createPortal(
    <div className="delete-confirm-modal" onClick={handleOverlayClick}>
      <div className="delete-confirm-modal-overlay" />
      <div className="delete-confirm-modal-content">
        <h2 className="delete-confirm-modal-title">Удалить клиента?</h2>
        <div className="delete-confirm-modal-actions">
          <button
            className="delete-confirm-modal-button delete-confirm-modal-button-cancel"
            onClick={onClose}
            type="button"
          >
            Отмена
          </button>
          <button
            className="delete-confirm-modal-button delete-confirm-modal-button-confirm"
            onClick={handleConfirm}
            type="button"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;

