# 📋 Инструкция по изменению переменных окружения (.env)

## 🔧 Что нужно изменить в .env файле

### 1. База данных (ОБЯЗАТЕЛЬНО)

```bash
MYSQL_ROOT_PASSWORD=strong_root_password_here
MYSQL_DATABASE=referral_vivat
MYSQL_USER=app_user
MYSQL_PASSWORD=strong_app_password_here
```

**Что изменить:**
- `MYSQL_ROOT_PASSWORD` - придумайте сильный пароль для root пользователя MySQL (минимум 16 символов)
- `MYSQL_PASSWORD` - придумайте сильный пароль для приложения (минимум 16 символов)
- `MYSQL_DATABASE` - можете оставить `referral_vivat` или изменить на свое имя
- `MYSQL_USER` - можете оставить `app_user` или изменить

**Пример:**
```bash
MYSQL_ROOT_PASSWORD=MyS3cur3R00tP@ssw0rd!2024
MYSQL_DATABASE=referral_vivat
MYSQL_USER=vivat_app
MYSQL_PASSWORD=V1v@tApp$ecureP@ss2024
```

### 2. URLs и домен (ОБЯЗАТЕЛЬНО)

```bash
CLIENT_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api
VITE_API_URL=https://yourdomain.com/api
```

**Что изменить:**
- Замените `yourdomain.com` на ваш реальный домен
- Если у вас нет SSL сертификата сразу, временно можете использовать `http://` вместо `https://`
- Если работаете по IP адресу: `http://YOUR_VPS_IP`

**Примеры:**

С доменом:
```bash
CLIENT_URL=https://vivat-referral.com
API_URL=https://vivat-referral.com/api
VITE_API_URL=https://vivat-referral.com/api
```

С IP (временно, без SSL):
```bash
CLIENT_URL=http://123.45.67.89
API_URL=http://123.45.67.89/api
VITE_API_URL=http://123.45.67.89/api
```

### 3. JWT секреты (ОБЯЗАТЕЛЬНО)

```bash
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
```

**Что изменить:**
- Сгенерируйте 2 случайные строки минимум 32 символа каждая
- Используйте разные строки для ACCESS и REFRESH

**Команда для генерации (на VPS):**
```bash
openssl rand -base64 32
```

**Пример:**
```bash
JWT_ACCESS_SECRET=kJ8mN2pQ5rT9vX3zA6bD1eG4hK7lO0sW2yB5cF8iL1nM4pR7tV0xY3
JWT_REFRESH_SECRET=aE4gH7jK0mN3pQ6rT9uW2xZ5bC8eF1hJ4kM7nP0qS3tV6yA9dG2iL5
```

### 4. SMTP настройки для Email (ОБЯЗАТЕЛЬНО)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

**Для Gmail:**

1. Включите двухфакторную аутентификацию в Google аккаунте
2. Создайте App Password:
   - Перейдите: https://myaccount.google.com/apppasswords
   - Выберите "Почта" и "Другое устройство"
   - Скопируйте сгенерированный пароль (16 символов)
3. Используйте этот App Password в `SMTP_PASSWORD`

**Пример:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=vivat.system@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # App Password из Google
SMTP_FROM=vivat.system@gmail.com
```

**Для других email провайдеров:**

Mail.ru:
```bash
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourname@mail.ru
SMTP_PASSWORD=your-password
SMTP_FROM=yourname@mail.ru
```

Yandex:
```bash
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourname@yandex.ru
SMTP_PASSWORD=your-password
SMTP_FROM=yourname@yandex.ru
```

### 5. Опциональные настройки

```bash
PORT=3000                # Порт backend (можно оставить)
CLIENT_PORT=80           # Порт frontend (можно оставить)
NODE_ENV=production      # Режим работы (оставить production)
```

Обычно эти параметры не нужно менять.

## 📝 Полный пример .env файла

```bash
# База данных
MYSQL_ROOT_PASSWORD=MyS3cur3R00tP@ssw0rd!2024
MYSQL_DATABASE=referral_vivat
MYSQL_USER=vivat_app
MYSQL_PASSWORD=V1v@tApp$ecureP@ss2024

# Server
PORT=3000
NODE_ENV=production

# URLs (ваш домен)
CLIENT_URL=https://vivat-referral.com
API_URL=https://vivat-referral.com/api
VITE_API_URL=https://vivat-referral.com/api

# Порт клиента
CLIENT_PORT=80

# JWT секреты (сгенерированные)
JWT_ACCESS_SECRET=kJ8mN2pQ5rT9vX3zA6bD1eG4hK7lO0sW2yB5cF8iL1nM4pR7tV0xY3
JWT_REFRESH_SECRET=aE4gH7jK0mN3pQ6rT9uW2xZ5bC8eF1hJ4kM7nP0qS3tV6yA9dG2iL5

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=vivat.system@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=vivat.system@gmail.com
```

## ⚡ Быстрый старт

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Отредактируйте `.env`:
```bash
nano .env
```

3. Измените все значения как указано выше

4. Сохраните файл (Ctrl+O, Enter, Ctrl+X)

5. Запустите проект:
```bash
docker compose up -d --build
```

## 🔐 Безопасность

- ❌ **НИКОГДА** не коммитьте файл `.env` в git
- ✅ Используйте **сильные пароли** (минимум 16 символов)
- ✅ Разные секреты для `JWT_ACCESS_SECRET` и `JWT_REFRESH_SECRET`
- ✅ Для production всегда используйте `https://` (настройте SSL)
- ✅ Регулярно меняйте пароли базы данных

## 🆘 Помощь

Если что-то не работает:

1. Проверьте логи:
```bash
docker compose logs -f
```

2. Проверьте статус контейнеров:
```bash
docker compose ps
```

3. Убедитесь что все переменные заполнены (без `your-`, `example.com` и т.д.)

4. Проверьте что порты 80 и 443 открыты на VPS:
```bash
sudo ufw status
```
