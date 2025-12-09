FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Регенерируем Prisma клиент в финальном контейнере
RUN npx prisma generate

# Копируем сгенерированный Prisma клиент в dist/generated
RUN cp -r /app/src/generated /app/dist/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]


