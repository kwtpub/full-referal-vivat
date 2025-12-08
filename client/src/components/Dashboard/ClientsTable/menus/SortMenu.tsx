import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './SortMenu.css';

export type SortOption = 'name' | 'status' | 'stage' | 'boat' | 'date';

interface SortMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (option: SortOption) => void;
  position: { top: number; left: number };
  width: number;
}

const SortMenu = ({ 
  isOpen, 
  onClose, 
  onSort, 
  position,
  width
}: SortMenuProps) => {
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

  const handleSort = (option: SortOption) => {
    onSort(option);
    onClose();
  };

  return createPortal(
    <div 
      ref={menuRef} 
      className="sort-menu" 
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
      }}
    >
      <button 
        className="sort-menu-item" 
        onClick={() => handleSort('name')}
        type="button"
      >
        По имени
      </button>
      <button 
        className="sort-menu-item" 
        onClick={() => handleSort('status')}
        type="button"
      >
        По статусу
      </button>
      <button 
        className="sort-menu-item" 
        onClick={() => handleSort('stage')}
        type="button"
      >
        По этапу воронки
      </button>
      <button 
        className="sort-menu-item" 
        onClick={() => handleSort('boat')}
        type="button"
      >
        По типу лодки
      </button>
    </div>,
    document.body
  );
};

export default SortMenu;

