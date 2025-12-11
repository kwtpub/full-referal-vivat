import DropdownMenu from './menus/DropdownMenu';
import { useDropdownMenu } from './hooks/useDropdownMenu';
import type { Deal } from './ClientsTable';

interface DealMenuButtonProps {
  deal: Deal;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

const DealMenuButton = ({ deal, onEdit, onDelete, isAdmin = false, onApprove, onReject }: DealMenuButtonProps) => {
  const { isOpen, position, buttonRef, toggleMenu, closeMenu } = useDropdownMenu();

  // Показываем админские действия только если пользователь админ И сделка ожидает подтверждения
  const showAdminActions = isAdmin && deal.pendingApproval;

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
          position={position}
          showAdminActions={showAdminActions}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </>
  );
};

export default DealMenuButton;
