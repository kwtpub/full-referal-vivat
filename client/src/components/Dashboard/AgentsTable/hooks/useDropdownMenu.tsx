import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDropdownMenuReturn {
  isOpen: boolean;
  position: { top: number; left: number };
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleMenu: (event: React.MouseEvent) => void;
  closeMenu: () => void;
}

export const useDropdownMenu = (): UseDropdownMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 180;
    const spacing = 8;

    // Позиция по вертикали - сразу под кнопкой
    const top = rect.bottom + spacing;

    // Позиция по горизонтали - справа от кнопки, выровнено по правому краю
    let left = rect.left - menuWidth + rect.width;
    
    // Проверяем, не выходит ли меню за левую границу экрана
    if (left < spacing) {
      left = rect.left; // Выравниваем по левому краю кнопки
    }

    setPosition({ top, left });
  }, []);

  const toggleMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();

      const handleScroll = () => {
        if (isOpen) {
          calculatePosition();
        }
      };

      const handleResize = () => {
        if (isOpen) {
          calculatePosition();
        }
      };

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, calculatePosition]);

  return {
    isOpen,
    position,
    buttonRef,
    toggleMenu,
    closeMenu,
  };
};

