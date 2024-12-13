import { User } from '../../node_modules/.prisma/client/index.js';
import prisma from '../config/prisma.js';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  createOrUpdate(provider: string, providerId: string, email: string, nickname?: string): Promise<User>;
}

export class UserRepository implements IUserRepository {
  async findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async save(user: User) {
    return prisma.user.create({
      data: { ...user },
    });
  }

  async update(id: number, data: Partial<User>) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async createOrUpdate(provider: string, providerId: string, email: string, nickname?: string) {
    return prisma.user.upsert({
      where: { email },
      update: { provider, providerId },
      create: { provider, providerId, email, nickname },
    });
  }
}

const userRepository = new UserRepository();

export default userRepository;