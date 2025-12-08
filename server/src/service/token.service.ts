import jwt from 'jsonwebtoken';
import { ToketModel } from '../models/token.model.js';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  isActivated: boolean;
}

export class TokenService {
  private static accessSecret = process.env.JWT_ACCESS_SECRET;
  private static refreshSecret = process.env.JWT_REFRESH_SECRET;

  public static generateTokens(payload: JwtPayload) {
    if (!TokenService.accessSecret || !TokenService.refreshSecret) {
      throw new Error(
        'JWT secrets are not configured. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in environment.',
      );
    }

    const accessToken = jwt.sign(payload, TokenService.accessSecret, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, TokenService.refreshSecret, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  public static async saveToken(agentId: any, refreshToken: any) {
    console.log(`typeof agentid ${typeof agentId}`);
    console.log(`typeof refresh ${typeof refreshToken}`);
    return ToketModel.save(agentId, refreshToken);
  }

  public static async removeToken(refreshToken: string) {
    return ToketModel.delete(refreshToken);
  }

  public static async findToken(refreshToken: string) {
    return ToketModel.findByToken(refreshToken);
  }

  public static async validateRefresh(token: string) {
    try {
      const agentData = jwt.verify(token, TokenService.refreshSecret!);
      return agentData;
    } catch (e) {
      return null;
    }
  }

  public static async validateAccess(token: string) {
    try {
      return jwt.verify(token, TokenService.accessSecret!);
    } catch (e) {
      return null;
    }
  }
}
