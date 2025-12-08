import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/router.js';
import { ApiError } from './exceptions/error-api.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ======== CORS должен быть САМИМ ПЕРВЫМ ========

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [
      'http://localhost:5173',
      'https://kjrtlbms-5173.euw.devtunnels.ms',
    ];

const isDev = process.env.NODE_ENV !== 'production';

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // В development разрешаем все origins (включая dev tunnels)
      if (isDev || !origin) return callback(null, true);

      // Проверяем точное совпадение или совпадение без протокола
      const normalizedOrigin = origin?.toLowerCase();
      const isAllowed = allowedOrigins.some((allowed) => {
        const normalizedAllowed = allowed.toLowerCase();
        return normalizedOrigin === normalizedAllowed || 
               normalizedOrigin === normalizedAllowed.replace(/^https?:\/\//, '');
      });

      if (isAllowed) {
        return callback(null, true);
      }

      // Логируем для отладки
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
  })
);

// ======== Далее обычные middlewares ========
app.use(express.json());
app.use(cookieParser());

// ======== Routes ========
app.use('/api', router);

// ======== Error handler ========
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.log('Unexpected error:', err.message);
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
});

// ======== Start ========
app.listen(PORT, () => {
  console.log(`server start port: ${PORT}`);
});
