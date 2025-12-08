import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Input, Checkbox } from '../../../ui';
import AgentService, { type Agent } from '../../../../service/AgentService';
import './EditAgentModal.css';

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  agent: Agent | null;
}

const EditAgentModal = ({ isOpen, onClose, onSuccess, agent }: EditAgentModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Заполняем форму данными агента при открытии
  useEffect(() => {
    if (isOpen && agent) {
      setName(agent.name);
      setEmail(agent.email);
      setIsActive(agent.isActive);
      setErrors({});
      setServerError('');
    }
  }, [isOpen, agent]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Сброс формы при закрытии
      setName('');
      setEmail('');
      setIsActive(true);
      setErrors({});
      setServerError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Введите корректный email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!agent) return;

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await AgentService.update(agent.id, {
        name: name.trim(),
        email: email.trim(),
        isActive,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка при обновлении агента';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="edit-agent-modal">
      <div className="edit-agent-modal-overlay" onClick={onClose} />
      <div className="edit-agent-modal-content">
        <div className="edit-agent-modal-header">
          <h2 className="edit-agent-modal-title">Редактировать агента</h2>
          <button
            className="edit-agent-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form className="edit-agent-modal-form" onSubmit={handleSubmit}>
          <div className="edit-agent-modal-form-row">
            <div className="edit-agent-modal-form-fields">
              <Input
                label="Имя"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Введите имя агента"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Введите email агента"
              />
            </div>

            <div className="edit-agent-modal-form-checkboxes">
              <div className="edit-agent-modal-checkbox-group">
                <span className="edit-agent-modal-checkbox-title">Статус</span>
                <Checkbox
                  label="Активен"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {serverError && (
            <div className="edit-agent-modal-error">{serverError}</div>
          )}

          <div className="edit-agent-modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditAgentModal;

