# Referal Vivat - Deployment Guide

## 🚀 Развертывание на VPS

### Предварительные требования

**📋 Технические требования VPS:** См. [VPS_REQUIREMENTS.md](./VPS_REQUIREMENTS.md)

**Рекомендуемая конфигурация для production:**
- CPU: 2 ядра
- RAM: 2 GB
- Диск: 25 GB SSD
- ОС: Ubuntu 22.04 LTS

На вашем VPS должны быть установлены:
- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)
- Git

### Шаг 1: Установка Docker (если не установлен)

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose-plugin

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### Шаг 2: Клонирование репозитория

```bash
cd /home/your-user
git clone https://github.com/yourusername/Referal-vivat.git
cd Referal-vivat
```

### Шаг 3: Настройка переменных окружения

Скопируйте `.env.example` в `.env` и отредактируйте его:

```bash
cp .env.example .env
nano .env
```

### Обязательные изменения в `.env`:

```bash
# База данных - установите надежные пароли
MYSQL_ROOT_PASSWORD=your_very_strong_root_password_here
MYSQL_DATABASE=referral_vivat
MYSQL_USER=app_user
MYSQL_PASSWORD=your_very_strong_app_password_here

# URLs - замените на ваш реальный домен
CLIENT_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api
VITE_API_URL=https://yourdomain.com/api

# JWT секреты - сгенерируйте случайные строки (минимум 32 символа)
# Можно сгенерировать командой: openssl rand -base64 32
JWT_ACCESS_SECRET=your-generated-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-generated-refresh-secret-min-32-chars

# Email настройки (для Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Для Gmail нужен App Password
SMTP_FROM=your-email@gmail.com
```

### Генерация JWT секретов:

```bash
# Генерация ACCESS секрета
openssl rand -base64 32

# Генерация REFRESH секрета  
openssl rand -base64 32
```

### Шаг 4: Настройка SMTP (Gmail)

Для Gmail нужно:
1. Включить двухфакторную аутентификацию
2. Создать App Password: https://myaccount.google.com/apppasswords
3. Использовать этот App Password в `SMTP_PASSWORD`

### Шаг 5: Сборка frontend

```bash
# Установка зависимостей и сборка клиента
cd client
npm install
npm run build

# Копирование сборки
cd ..
rm -rf client-build
cp -r client/dist client-build
```

Или используйте готовый скрипт:
```bash
./build.sh
```

### Шаг 6: Запуск проекта

```bash
# Для production (рекомендуется)
docker compose -f docker-compose.prod.yml up -d --build

# Или используйте стандартный docker-compose.yml
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Проверка статуса контейнеров
docker compose ps
```

### Шаг 7: Настройка домена и DNS

1. Привяжите ваш домен к IP адресу VPS в настройках DNS
2. Добавьте A-запись: `yourdomain.com` -> `IP вашего VPS`
3. Добавьте A-запись: `www.yourdomain.com` -> `IP вашего VPS`

### Шаг 8: Настройка SSL (опционально, но рекомендуется)

#### Использование Let's Encrypt с Certbot:

```bash
# Установка Certbot
sudo apt install certbot

# Получение SSL сертификата
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Копирование сертификатов
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
sudo chmod -R 755 nginx/ssl
```

После этого раскомментируйте HTTPS блок в `nginx/nginx.conf` и перезапустите:

```bash
docker compose restart nginx
```

### Автообновление SSL сертификата:

```bash
# Создание скрипта обновления
sudo nano /etc/cron.daily/certbot-renew
```

Содержимое скрипта:
```bash
#!/bin/bash
certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /home/your-user/Referal-vivat/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /home/your-user/Referal-vivat/nginx/ssl/key.pem && docker compose -f /home/your-user/Referal-vivat/docker-compose.yml restart nginx"
```

```bash
sudo chmod +x /etc/cron.daily/certbot-renew
```

## 🛠 Управление проектом

### Просмотр логов:
```bash
docker compose logs -f              # Все сервисы
docker compose logs -f server       # Только backend
docker compose logs -f client       # Только frontend
docker compose logs -f db           # Только БД
```

### Перезапуск сервисов:
```bash
docker compose restart              # Все сервисы
docker compose restart server       # Только backend
docker compose restart nginx        # Только nginx
```

### Остановка и запуск:
```bash
docker compose down                 # Остановка всех контейнеров
docker compose up -d                # Запуск в фоновом режиме
docker compose up -d --build        # Пересборка и запуск
```

### Обновление кода:
```bash
git pull

# Пересобрать клиент
./build.sh

# Перезапустить контейнеры
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Резервное копирование БД:
```bash
# Создание бэкапа
docker compose exec db mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker compose exec -T db mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < backup_file.sql
```

### Очистка:
```bash
# Удаление неиспользуемых образов и контейнеров
docker system prune -a

# Удаление проекта с данными
docker compose down -v  # ВНИМАНИЕ: удалит все данные БД!
```

## 🔐 Безопасность

1. **Никогда** не коммитьте файл `.env` в git
2. Используйте **сильные пароли** для базы данных
3. Регулярно **обновляйте** зависимости и Docker образы
4. Настройте **firewall** на VPS:
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```
5. Измените стандартный порт SSH (опционально)
6. Настройте автоматические обновления безопасности

## 📊 Мониторинг

Проверка статуса:
```bash
# Использование ресурсов
docker stats

# Состояние контейнеров
docker compose ps

# Проверка health check
docker inspect --format='{{.State.Health.Status}}' referal-vivat-server-1
```

## ❗ Решение проблем

### Контейнер не запускается:
```bash
docker compose logs <service-name>
```

### База данных не подключается:
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь что контейнер БД запущен: `docker compose ps`
- Проверьте логи БД: `docker compose logs db`

### Frontend не загружается:
- Проверьте что `VITE_API_URL` указывает на правильный домен
- Убедитесь что nginx запущен: `docker compose ps nginx`
- Проверьте логи: `docker compose logs nginx`

### Email не отправляются:
- Проверьте SMTP настройки в `.env`
- Для Gmail убедитесь что используете App Password
- Проверьте логи сервера: `docker compose logs server`

## 📝 Структура проекта

```
.
├── client/                 # React frontend
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Node.js backend
│   ├── Dockerfile
│   └── prisma/
├── nginx/                  # Nginx reverse proxy
│   ├── nginx.conf
│   └── ssl/               # SSL сертификаты
├── docker-compose.yml     # Конфигурация Docker Compose
└── .env                   # Переменные окружения (не в git!)
```
