import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DropdownMenu.css';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewClients: () => void;
  position: { top: number; left: number };
}

const DropdownMenu = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  onViewClients,
  position
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

  const handleViewClients = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewClients();
    onClose();
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
      <button 
        className="dropdown-menu-item" 
        onClick={handleEdit}
        type="button"
      >
        Редактировать
      </button>
      <button 
        className="dropdown-menu-item" 
        onClick={handleViewClients}
        type="button"
      >
        Клиенты
      </button>
      <button 
        className="dropdown-menu-item dropdown-menu-item-danger" 
        onClick={handleDelete}
        type="button"
      >
        Удалить
      </button>
    </div>,
    document.body
  );
};

export default DropdownMenu;

