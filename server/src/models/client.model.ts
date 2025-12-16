import { ApiError } from '../exceptions/error-api.js';
import { prisma } from '../prisma.singleton.js';

export class ClientModel {
  static async create(name: string, phone: string, agentId: string) {
    try {
      const client = await prisma.client.create({
        data: {
          name,
          phone,
          agentId,
        },
      });
      return client;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw ApiError.BadRequest(409, 'Клиент с таким номером уже существует');
      }
      if (e.code === 'P2003') {
        throw ApiError.BadRequest(404, 'Агент не найден');
      }
      throw e;
    }
  }

  static async delete(phone: string) {
    return prisma.client.delete({
      where: {
        phone,
      },
    });
  }

  static async deleteById(id: string) {
    return prisma.client.delete({
      where: {
        id,
      },
    });
  }
  public static async update(id: string, name: string, phone: string) {
    return prisma.client.update({where: {
      id,
    },
      data: {
        name,
        phone
      }
    })
  }

  public static async getClients() {
    return prisma.client.findMany();
  }

  public static async getClientsFromAgent(agentId: any) {
    return prisma.client.findMany({
      where: {
        agentId
      }
    });
  }

  static async findByPhone(phone: string) {
    return prisma.client.findUnique({ where: { phone } });
  }

  static async findByAgentId(agentId: string) {
    return prisma.client.findMany({ where: { agentId } });
  }

  static async findById(id: string) {
    return prisma.client.findUnique({ where: { id } });
  }

  /**
   * Массовая привязка существующих клиентов к агенту по их ID
   * Оптимизированная операция на уровне БД через updateMany
   */
  static async bindClientsToAgent(clientIds: string[], agentId: string) {
    try {
      const result = await prisma.client.updateMany({
        where: {
          id: {
            in: clientIds,
          },
        },
        data: {
          agentId,
        },
      });
      return result;
    } catch (e: any) {
      throw ApiError.BadRequest(400, `Ошибка привязки клиентов: ${e.message}`);
    }
  }

  /**
   * Массовая привязка клиентов к агенту по номерам телефонов
   * Оптимизированная операция через транзакцию
   */
  static async bindClientsToAgentByPhones(phones: string[], agentId: string) {
    try {
      const result = await prisma.$transaction(
        phones.map((phone) =>
          prisma.client.update({
            where: { phone },
            data: { agentId },
          }),
        ),
      );
      return result;
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw ApiError.BadRequest(404, 'Один или несколько клиентов не найдены');
      }
      throw ApiError.BadRequest(400, `Ошибка привязки клиентов: ${e.message}`);
    }
  }

  /**
   * Массовое создание клиентов с привязкой к агенту
   * Оптимизированная операция через createMany
   */
  static async createManyClients(
    clients: Array<{ name: string; phone: string }>,
    agentId: string,
  ) {
    try {
      const result = await prisma.client.createMany({
        data: clients.map((client) => ({
          name: client.name,
          phone: client.phone,
          agentId,
        })),
        skipDuplicates: true, // Пропускает дубликаты по уникальному полю phone
      });
      return result;
    } catch (e: any) {
      throw ApiError.BadRequest(400, `Ошибка создания клиентов: ${e.message}`);
    }
  }

}
