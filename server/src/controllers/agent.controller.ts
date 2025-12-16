import { ApiError } from '../exceptions/error-api.js';
import { validationResult } from 'express-validator';
import { AgentService } from '../service/agent.service.js';

export class AgentController {
  public static async registration(req: any, res: any, next: any) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest(
          400,
          'Ошибка валидации: ' +
            errors
              .array()
              .map((e) => e.msg)
              .join(', '),
        );
      }
      const { name, email, password } = req.body;
      const userData = await AgentService.registeration(name, email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  public static async login(req: any, res: any, next: any) {
    try {
      const { name, email, password } = req.body;
      const agentData = await AgentService.login(email, password, name);
      res.cookie('refreshToken', agentData.refreshToken, {
        maxage: 30 * 24 * 60 * 60 * 1000,
        httponly: true,
      });
      return res.json(agentData);
    } catch (e) {
      next(e);
    }
  }

  public static async activate(req: any, res: any, next: any) {
    try {
      const activationLink = req.params.link;
      await AgentService.activation(activationLink);
      return res.status(200).json({ message: 'Профиль активирован' });
    } catch (e) {
      next(e);
    }
  }

  public static async logout(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token отсутствует' });
      }
      await AgentService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json({ message: 'Выход выполнен успешно' });
    } catch (e) {
      next(e);
    }
  }

  public static async refresh(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const agentData = await AgentService.refresh(refreshToken);
      res.cookie('refreshToken', agentData.refreshToken, {
        maxage: 30 * 24 * 60 * 60 * 1000,
        httponly: true,
      });
      return res.json(agentData);
    } catch (e) {
      next(e);
    }
  }

  public static async getAllUsers(req: any, res: any, next: any) {
    try {
      const users = await AgentService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public static async getAgentsWithStats(req: any, res: any, next: any) {
    try {
      const agents = await AgentService.getAgentsWithStats();
      return res.json(agents);
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: any, res: any, next: any) {
    try {
      const agentId = req.params.id;
      const { name, email, isActive } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: 'Имя и email обязательны' });
      }

      const updatedAgent = await AgentService.update(agentId, name, email, isActive ?? true);
      return res.json(updatedAgent);
    } catch (e) {
      next(e);
    }
  }

  public static async getTotalStats(req: any, res: any, next: any) {
    try {
      const stats = await AgentService.getTotalStats();
      return res.json(stats);
    } catch (e) {
      next(e);
    }
  }

  public static async getAgentStats(req: any, res: any, next: any) {
    try {
      const agentId = req.params.agentId;
      const stats = await AgentService.getAgentStats(agentId);
      return res.json(stats);
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: any, res: any, next: any) {
    try {
      const agentId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const result = await AgentService.delete(agentId, refreshToken);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}
