import { prisma } from '../prisma.singleton.js';

export class ToketModel {
  public static async save(agentId: string, refreshToken: string) {
    const existing = await prisma.token.findFirst({
      where: { agentId },
    });
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (existing) {
      return prisma.token.update({
        where: { id: existing.id },
        data: { refreshToken, expiresAt },
      });
    }

    return prisma.token.create({
      data: {
        refreshToken,
        agentId,
        expiresAt,
      },
    });
  }

  public static async findByToken(refreshToken: string) {
    return prisma.token.findUnique({
      where: { refreshToken },
    });
  }

  public static async delete(refreshToken: string) {
    const token = await prisma.token.findUnique({
      where: { refreshToken },
    });

    if (!token) {
      return { count: 0 };
    }

    return prisma.token.delete({
      where: { refreshToken },
    });
  }
}
