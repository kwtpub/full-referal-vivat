import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSortMenuReturn {
  isOpen: boolean;
  position: { top: number; left: number };
  width: number;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleMenu: (event: React.MouseEvent) => void;
  closeMenu: () => void;
}

export const useSortMenu = (): UseSortMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [width, setWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = rect.width; // Ширина меню = ширина кнопки
    const spacing = 0; // Без отступа, чтобы меню слилось с кнопкой

    // Позиция по вертикали - сразу под кнопкой без отступа
    const top = rect.bottom + spacing;

    // Позиция по горизонтали - выровнено по левому краю кнопки
    const left = rect.left;

    setPosition({ top, left });
    setWidth(menuWidth);
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
    width,
    buttonRef,
    toggleMenu,
    closeMenu,
  };
};

