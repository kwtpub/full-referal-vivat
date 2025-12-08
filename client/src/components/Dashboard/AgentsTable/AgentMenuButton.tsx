import DropdownMenu from './menus/DropdownMenu';
import { useDropdownMenu } from './hooks/useDropdownMenu';
import type { Agent } from '../../../service/AgentService';

interface AgentMenuButtonProps {
  agent: Agent;
  onEdit: () => void;
  onDelete: () => void;
  onViewClients: () => void;
}

const AgentMenuButton = ({ agent, onEdit, onDelete, onViewClients }: AgentMenuButtonProps) => {
  const { isOpen, position, buttonRef, toggleMenu, closeMenu } = useDropdownMenu();

  return (
    <>
      <button
        ref={buttonRef}
        className="dashboard-more-button"
        onClick={toggleMenu}
        type="button"
        aria-label="Меню действий"
        aria-expanded={isOpen}
      >
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10.25" cy="3.42" r="1.71" fill="currentColor"/>
          <circle cx="10.25" cy="10.25" r="1.71" fill="currentColor"/>
          <circle cx="10.25" cy="17.08" r="1.71" fill="currentColor"/>
        </svg>
      </button>
      {isOpen && (
        <DropdownMenu
          isOpen={isOpen}
          onClose={closeMenu}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewClients={onViewClients}
          position={position}
        />
      )}
    </>
  );
};

export default AgentMenuButton;

