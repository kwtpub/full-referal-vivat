import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Button, Input, Checkbox } from '../../../ui';
import ClientService from '../../../../service/ClientService';
import DealService, { type Status, type Stage } from '../../../../service/DealService';
import { Context } from '../../../../main';
import type { Deal } from '../ClientsTable';
import './EditClientModal.css';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  deal: Deal | null;
}

const EditClientModal = ({ isOpen, onClose, onSuccess, deal }: EditClientModalProps) => {
  const { store } = useContext(Context);
  const isAdmin = store.user.isAdmin || false;
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [boatName, setBoatName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  const [selectedStage, setSelectedStage] = useState<Stage | ''>('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; boatName?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const statusTypes: { value: Status; label: string }[] = [
    { value: 'Холодный', label: 'Холодный' },
    { value: 'Средний', label: 'Средний' },
    { value: 'Горячий', label: 'Горячий' },
  ];

  const stageTypes: { value: Stage; label: string }[] = [
    { value: 'Открыто', label: 'Открыто' },
    { value: 'Согласование', label: 'Согласование' },
    { value: 'Закрыто', label: 'Закрыто' },
  ];

  // Заполняем форму данными сделки при открытии
  useEffect(() => {
    if (isOpen && deal) {
      setName(deal.client.name);
      // Если телефон уже в формате +7 (XXX) XXX-XX-XX, используем его, иначе форматируем
      const phoneValue = deal.client.phone;
      if (phoneValue && phoneValue.includes('+7')) {
        setPhone(phoneValue);
      } else {
        // Форматируем телефон из цифр
        const digits = phoneValue.replace(/\D/g, '');
        let formatted = '';
        if (digits.length > 0) {
          formatted = '+7';
          if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4);
            if (digits.length > 4) {
              formatted += ') ' + digits.slice(4, 7);
              if (digits.length > 7) {
                formatted += '-' + digits.slice(7, 9);
                if (digits.length > 9) {
                  formatted += '-' + digits.slice(9, 11);
                }
              }
            } else {
              formatted += ')';
            }
          }
        }
        setPhone(formatted);
      }
      setBoatName(deal.interestBoat || '');
      setSelectedStatus(deal.status);
      setSelectedStage(deal.stage);
      setErrors({});
      setServerError('');
    }
  }, [isOpen, deal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Сброс формы при закрытии
      setName('');
      setPhone('');
      setBoatName('');
      setSelectedStatus('');
      setSelectedStage('');
      setErrors({});
      setServerError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Обработчик изменения телефона с маской
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Ограничиваем длину (11 цифр максимум)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    // Если начинается с 8, заменяем на 7
    if (value.startsWith('8')) {
      value = '7' + value.slice(1);
    }
    
    // Если не начинается с 7, добавляем 7
    if (value.length > 0 && !value.startsWith('7')) {
      value = '7' + value;
    }
    
    // Форматируем в +7 (XXX) XXX-XX-XX
    let formatted = '';
    if (value.length > 0) {
      formatted = '+7';
      if (value.length > 1) {
        formatted += ' (' + value.slice(1, 4);
        if (value.length > 4) {
          formatted += ') ' + value.slice(4, 7);
          if (value.length > 7) {
            formatted += '-' + value.slice(7, 9);
            if (value.length > 9) {
              formatted += '-' + value.slice(9, 11);
            }
          }
        } else {
          formatted += ')';
        }
      }
    }
    
    setPhone(formatted);
  };

  // Нормализация российского номера телефона к формату +7 (XXX) XXX-XX-XX
  const normalizePhone = (phone: string): string | null => {
    // Удаляем все символы кроме цифр
    const digits = phone.replace(/\D/g, '');
    
    // Если номер начинается с 8, заменяем на 7
    let normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
    
    // Если номер начинается с 7, оставляем как есть
    if (!normalized.startsWith('7')) {
      return null; // Не российский номер
    }
    
    // Проверяем длину (должно быть 11 цифр: 7 + 10 цифр)
    if (normalized.length !== 11) {
      return null;
    }
    
    // Форматируем в +7 (XXX) XXX-XX-XX
    const code = normalized.slice(1, 4);
    const part1 = normalized.slice(4, 7);
    const part2 = normalized.slice(7, 9);
    const part3 = normalized.slice(9, 11);
    
    return `+7 (${code}) ${part1}-${part2}-${part3}`;
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; boatName?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else {
      const normalized = normalizePhone(phone);
      if (!normalized) {
        newErrors.phone = 'Введите корректный российский номер телефона';
      }
    }

    if (!boatName.trim()) {
      newErrors.boatName = 'Наименование лодки/катера обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!deal) return;

    if (!validateForm()) {
      return;
    }

    // Валидация выбранных параметров для Deal
    if (!selectedStatus) {
      setServerError('Выберите статус');
      return;
    }

    if (!selectedStage) {
      setServerError('Выберите интерес клиента');
      return;
    }

    setIsLoading(true);

    try {
      // Нормализуем номер телефона к единому формату +7 (XXX) XXX-XX-XX
      const normalizedPhone = normalizePhone(phone.trim());
      
      if (!normalizedPhone) {
        setServerError('Неверный формат номера телефона');
        setIsLoading(false);
        return;
      }

      // Обновляем клиента
      await ClientService.update(deal.clientId, name.trim(), normalizedPhone);

      // Обновляем сделку с указанным наименованием лодки
      await DealService.update(deal.id, {
        interestBoat: boatName.trim(),
        quantity: 1,
        stage: selectedStage as Stage,
        status: selectedStatus as Status,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка при обновлении клиента и сделки';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !deal) return null;

  return createPortal(
    <div className="edit-client-modal">
      <div className="edit-client-modal-overlay" onClick={onClose} />
      <div className="edit-client-modal-content">
        <div className="edit-client-modal-header">
          <h2 className="edit-client-modal-title">Редактировать клиента</h2>
          <button
            className="edit-client-modal-close"
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

        <form className="edit-client-modal-form" onSubmit={handleSubmit}>
          <div className="edit-client-modal-form-row">
            <div className="edit-client-modal-form-fields">
              <Input
                label="Имя"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="Введите имя клиента"
                disabled={isLoading}
              />

              <Input
                label="Телефон"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                placeholder="+7 (999) 999-99-99"
                disabled={isLoading}
                maxLength={18}
              />
            </div>

            <div className="edit-client-modal-form-checkboxes">
              <div className="edit-client-modal-checkbox-group">
                <h3 className="edit-client-modal-checkbox-title">Статус</h3>
                {statusTypes.map((status) => (
                  <Checkbox
                    key={status.value}
                    label={status.label}
                    checked={selectedStatus === status.value}
                    onChange={(e) => {
                      setSelectedStatus(e.target.checked ? status.value : '');
                    }}
                    disabled={isLoading || !isAdmin}
                  />
                ))}
              </div>

              <div className="edit-client-modal-checkbox-group">
                <h3 className="edit-client-modal-checkbox-title">Интерес клиента</h3>
                {stageTypes.map((stage) => (
                  <Checkbox
                    key={stage.value}
                    label={stage.label}
                    checked={selectedStage === stage.value}
                    onChange={(e) => {
                      setSelectedStage(e.target.checked ? stage.value : '');
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>

              <div className="edit-client-modal-checkbox-group">
                <Input
                  label="Наименование лодки/катера"
                  type="text"
                  value={boatName}
                  onChange={(e) => setBoatName(e.target.value)}
                  error={errors.boatName}
                  placeholder="Введите наименование лодки/катера или свой комментарий"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {serverError && (
            <div className="edit-client-modal-error">{serverError}</div>
          )}

          <div className="edit-client-modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              style={{background: '#7B7B87'}}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditClientModal;

