import { ApiError } from '../exceptions/error-api.js';
import { validationResult } from 'express-validator';
import { ClientService } from '../service/client.service.js';
import { ClientModel } from '../models/client.model.js';

export class ClientController {
  public static async create(req: any, res: any, next: any) {
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

      const { name, phone } = req.body;
      const refreshToken = req.cookies.refreshToken;
      const clientData = await ClientService.create(name, phone, refreshToken);
      return res.json(clientData);
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: any, res: any, next: any) {
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
      };
      const {phone} = req.body;
      const user = await ClientModel.findByPhone(phone);
      if(!user) {
        const data = ApiError.BadRequest(400, 'пользователя не существует')
        return res.json({message: data.message})
      }

      const deleteUser =  await ClientService.delete(phone);
      return res.json(deleteUser);
    } catch (e) {
      return ApiError.BadRequest(400, `Непредвиденная ошибка ${e}`);
    }
  }

  public static async deleteById(req: any, res: any, next: any) {
    try {
      const clientId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const deletedClient = await ClientService.deleteById(clientId, refreshToken);
      return res.json(deletedClient);
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: any, res: any, next: any) {
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
      };
      const {name, phone} = req.body;
      const clientId = req.params.id;
      const updateUser = await ClientService.update(clientId, name, phone);
      return res.json(updateUser);
    } catch(e) {
      return ApiError.BadRequest(400, `Непредвиденная ошибкa ${e}`);
    }
  }

  public static async getClients(req: any, res: any, next: any) {
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
      };
      const clients =  await ClientService.getClients();
      return res.json(clients)
    } catch(e) {
      return ApiError.BadRequest(400, `Непредвиденная ошибкa ${e}`);
    }
  }

  public static async getClientsFromAgent(req: any, res: any, next: any) {
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
      };
      const agentId = req.params.id;
      const clients =  await ClientService.getClientsFromAgent(agentId);
      return res.json(clients)
    } catch(e) {
      return ApiError.BadRequest(400, `Непредвиденная ошибкa ${e}`);
    }
  }

  public static async findByPhone(req: any, res: any, next: any) {
    try {
      const { phone } = req.query;
      if (!phone) {
        throw ApiError.BadRequest(400, 'Телефон обязателен');
      }
      const client = await ClientService.findByPhone(phone);
      return res.json(client);
    } catch (e) {
      next(e);
    }
  }

}
