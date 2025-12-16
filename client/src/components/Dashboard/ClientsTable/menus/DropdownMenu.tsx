import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DropdownMenu.css';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { top: number; left: number };
  showAdminActions?: boolean;
  isAdmin?: boolean;
  canEdit?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

const DropdownMenu = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  position,
  showAdminActions = false,
  isAdmin = false,
  canEdit = true,
  onApprove,
  onReject
}: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Добавляем обработчики с небольшой задержкой
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    onClose();
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove();
      onClose();
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReject) {
      onReject();
      onClose();
    }
  };

  return createPortal(
    <div 
      ref={menuRef} 
      className="dropdown-menu" 
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {showAdminActions && (
        <>
          <button 
            className="dropdown-menu-item dropdown-menu-item-success" 
            onClick={handleApprove}
            type="button"
          >
            ✓ Подтвердить продажу
          </button>
          <button 
            className="dropdown-menu-item dropdown-menu-item-warning" 
            onClick={handleReject}
            type="button"
          >
            ✗ Отклонить продажу
          </button>
          <div className="dropdown-menu-divider" />
        </>
      )}
      {canEdit && (
        <button 
          className="dropdown-menu-item" 
          onClick={handleEdit}
          type="button"
        >
          Редактировать
        </button>
      )}
      {isAdmin && (
        <button 
          className="dropdown-menu-item dropdown-menu-item-danger" 
          onClick={handleDelete}
          type="button"
        >
          Удалить
        </button>
      )}
    </div>,
    document.body
  );
};

export default DropdownMenu;

