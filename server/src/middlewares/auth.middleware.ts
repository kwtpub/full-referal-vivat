import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/error-api.js';
import { TokenService } from '../service/token.service.js';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError('Требуется авторизация'));
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError('Неверный токен'));
    }

    const userData = await TokenService.validateAccess(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError('Недействительный токен'));
    }

    (req as any).user = userData;
    return next();
  } catch (error) {
    return next(ApiError.UnauthorizedError('Ошибка проверки токена'));
  }
}

export async function registrationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
  } catch (e) {
    return next(ApiError.BadRequest(404, `ошибка проверки данных для регестрации: ${e}`));
  }
}
