# Локальный режим разработки

## Требования

- Node.js 20+
- MySQL база данных (запущенная локально или на удаленном сервере)

## Настройка

1. Создайте `server/.env` на основе `server/.env.example`
2. Укажите правильный `DATABASE_URL` для подключения к БД:
   ```
   DATABASE_URL="mysql://root:1234@localhost:3306/dev_vivat"
   ```

## Быстрый запуск

```bash
./run-dev.sh
```

Скрипт автоматически:
- Проверит наличие зависимостей и установит их при необходимости
- Сгенерирует Prisma клиент
- Запустит сервер на порту 3000
- Запустит клиент на порту 5173

## Ручной запуск

Если нужно запускать сервисы отдельно:

### Сервер
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### Клиент
```bash
cd client
npm install
npm run dev
```

## Доступ

- Клиент: http://localhost:5173
- Сервер API: http://localhost:3000

## Особенности

- Hot-reload для сервера (nodemon) и клиента (Vite)
- Быстрый запуск без Docker
- Изменения в коде применяются автоматически

## Docker (опциональный режим)

Если нужен запуск в Docker:
```bash
docker compose -f docker-compose.dev.yml up --build
```

⚠️ При использовании Docker используйте `host.docker.internal` вместо `localhost` в DATABASE_URL
