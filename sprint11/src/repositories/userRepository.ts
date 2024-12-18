import { User } from "@prisma/client";
import prisma from "../config/prisma";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  createOrUpdate(
    provider: string,
    providerId: string,
    email: string,
    nickname?: string,
  ): Promise<User>;
}

export class UserRepository implements IUserRepository {
  findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  save(user: User) {
    return prisma.user.create({
      data: { ...user },
    });
  }

  update(id: number, data: Partial<User>) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  createOrUpdate(
    provider: string,
    providerId: string,
    email: string,
    nickname?: string,
  ) {
    return prisma.user.upsert({
      where: { email },
      update: { provider, providerId },
      create: { provider, providerId, email, nickname },
    });
  }
}

const userRepository = new UserRepository();

export default userRepository;
