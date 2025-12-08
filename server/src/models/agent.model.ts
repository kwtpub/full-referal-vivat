import { Agent } from '../generated/prisma/client.js';
import { prisma } from '../prisma.singleton.js';

export class AgentModel {
  public static async create(
    name: string,
    email: string,
    passwordHash: string,
    activationLink: string,
  ) {
    return prisma.agent.create({
      data: {
        name: name,
        email: email,
        passwordHash: passwordHash,
        activationLink: activationLink,
      },
    });
  }

  public static async findByEmail(email: string) {
    return prisma.agent.findUnique({ where: { email } });
  }

  public static async findByActivationLink(activationLink: string) {
    return prisma.agent.findUnique({ where: { activationLink } });
  }

  public static async findByID(id: string) {
    return prisma.agent.findUnique({ where: { id } });
  }

  public static async findAll() {
    return prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        isAdmin: true,
        createdAt: true,
      },
    });
  }

  public static async update(id: string, data: { name?: string; email?: string; isActive?: boolean }) {
    return prisma.agent.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        isAdmin: true,
        createdAt: true,
      },
    });
  }
}
