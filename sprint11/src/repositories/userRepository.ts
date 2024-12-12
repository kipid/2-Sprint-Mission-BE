import prisma from '../config/prisma.js';

export interface IUserRepository {
  findById(id): Promise<any>;
  findByEmail(email): Promise<any>;
  save(user): Promise<any>;
  update(id, data): Promise<any>;
  createOrUpdate(provider, providerId, email, nickname): Promise<any>;
}

async function findById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return await prisma.User.findUnique({
    where: {
      email,
    },
  });
}

async function save({ password, ...user }) {
  return prisma.user.create({
    data: { ...user },
  });
}

async function update(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function createOrUpdate(provider, providerId, email, nickname) {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, nickname },
    create: { provider, providerId, email, nickname },
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
}
