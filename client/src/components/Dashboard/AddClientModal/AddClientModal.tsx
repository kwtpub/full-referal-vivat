import { useState, useEffect, useContext } from 'react';
import { Button, Input, Checkbox } from '../../ui';
import ClientService from '../../../service/ClientService';
import DealService, { type InterestBoat, type Status, type Stage } from '../../../service/DealService';
import { Context } from '../../../main';
import './AddClientModal.css';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddClientModal = ({ isOpen, onClose, onSuccess }: AddClientModalProps) => {
  const { store } = useContext(Context);
  const isAdmin = store.user.isAdmin || false;
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

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
  const [selectedBoats, setSelectedBoats] = useState<InterestBoat[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  const [selectedStage, setSelectedStage] = useState<Stage | ''>('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const boatTypes: { value: InterestBoat; label: string }[] = [
    { value: 'HardTop', label: 'Hard Top' },
    { value: 'ClassicBoat', label: 'Classic Boat' },
    { value: 'Bowrider', label: 'Bowrider' },
  ];

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Сброс формы при закрытии
      setName('');
      setPhone('');
      setSelectedBoats([]);
      setSelectedStatus('');
      setSelectedStage('');
      setErrors({});
      setServerError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    const newErrors: { name?: string; phone?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

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

    if (selectedBoats.length === 0) {
      setServerError('Выберите хотя бы один тип лодки');
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

      let clientId: string;

      // Проверяем, существует ли клиент с таким телефоном
      try {
        // Пытаемся найти существующего клиента (используем нормализованный номер)
        const existingClientResponse = await ClientService.findByPhone(normalizedPhone);
        const existingClient = existingClientResponse?.data as any;
        
        if (existingClient && existingClient.id) {
          // Клиент уже существует, используем его ID
          clientId = existingClient.id;
        } else {
          // Клиента нет, создаем нового (сохраняем в нормализованном формате)
          try {
            const newClientResponse = await ClientService.create(name.trim(), normalizedPhone);
            // Сервер возвращает объект клиента напрямую в data
            const newClient = newClientResponse?.data as any;
            
            if (!newClient || !newClient.id) {
              throw new Error('Не удалось получить ID созданного клиента');
            }
            
            clientId = newClient.id;
          } catch (createError: any) {
            // Если ошибка 409 - клиент уже существует, пытаемся найти его
            if (createError?.response?.status === 409) {
              const existingClientResponse = await ClientService.findByPhone(normalizedPhone);
              const existingClient = existingClientResponse?.data as any;
              
              if (existingClient && existingClient.id) {
                clientId = existingClient.id;
              } else {
                throw new Error('Клиент с таким телефоном уже существует, но не удалось получить его данные');
              }
            } else {
              throw createError;
            }
          }
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при работе с клиентом';
        setServerError(errorMessage);
        throw error;
      }

      // Проверяем, что clientId получен
      if (!clientId) {
        throw new Error('Не удалось получить ID клиента');
      }

      // Создаем Deal для каждого выбранного типа лодки
      // Сумма сделки рассчитывается автоматически на сервере
      const dealPromises = selectedBoats.map((boat) =>
        DealService.create(clientId, {
          interestBoat: boat,
          quantity: 1,
          stage: selectedStage as Stage,
          status: selectedStatus as Status,
        })
      );

      await Promise.all(dealPromises);

      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Ошибка при создании клиента и сделки';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-client-modal">
      <div className="add-client-modal-overlay" onClick={onClose} />
      <div className="add-client-modal-content">
        <div className="add-client-modal-header">
          <h2 className="add-client-modal-title">Добавить клиента</h2>
          <button
            className="add-client-modal-close"
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

        <form className="add-client-modal-form" onSubmit={handleSubmit}>
          <div className="add-client-modal-form-row">
            <div className="add-client-modal-form-fields">
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

            <div className="add-client-modal-form-checkboxes">
              <div className="add-client-modal-checkbox-group">
                <h3 className="add-client-modal-checkbox-title">Статус</h3>
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

              <div className="add-client-modal-checkbox-group">
                <h3 className="add-client-modal-checkbox-title">Интерес клиента</h3>
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

              <div className="add-client-modal-checkbox-group">
                <h3 className="add-client-modal-checkbox-title">Тип лодки</h3>
                {boatTypes.map((boat) => (
                  <Checkbox
                    key={boat.value}
                    label={boat.label}
                    checked={selectedBoats.includes(boat.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBoats([...selectedBoats, boat.value]);
                      } else {
                        setSelectedBoats(selectedBoats.filter((b) => b !== boat.value));
                      }
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
          </div>

          {serverError && (
            <div className="add-client-modal-error">{serverError}</div>
          )}

          <div className="add-client-modal-actions">
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
              {isLoading ? 'Создание...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;

