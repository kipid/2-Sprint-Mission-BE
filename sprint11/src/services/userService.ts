import userRepository from "../repositories/userRepository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpStatus from "../httpStatus.js";
import { User } from "../../node_modules/.prisma/client/index.js";
import { CustomError } from "../types/types.js";

async function hashingPassword(password: string) { // 함수 추가
  return bcrypt.hash(password, 10); // 2^10 번 hash
}

function createToken(userId: number, type: 'refresh' | 'access') {
  const payload = { userId };
  const options = {
    expiresIn: type === 'refresh' ? '1w' : '1d',
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
}

export type FilteredUser = Omit<User, 'encryptedPassword' | 'refreshToken'>;

function filterSensitiveUserData(user: User & { password?: string }): FilteredUser {
  const { password, encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

async function createUser(user: User & { password: string }) {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const error = new Error('User already exists');
    throw error;
  }

  const hashedPassword: string = await hashingPassword(user.password); // 해싱 과정 추가
  const createdUser = await userRepository.save({ ...user, encryptedPassword: hashedPassword }); // password 추가
  return filterSensitiveUserData(createdUser);
}

async function verifyPassword(inputPassword: string, savedPassword: string | null) {
  if (savedPassword === null) {
    const error = new CustomError('Unauthorized: Wrong password!', HttpStatus.UNAUTHORIZED);
    throw error;
  }
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new CustomError('Unauthorized: Wrong password!', HttpStatus.UNAUTHORIZED);
    throw error;
  }
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new CustomError('User not found.', HttpStatus.NOT_FOUND);
    throw error;
  }
  verifyPassword(password, user.encryptedPassword);
  return filterSensitiveUserData(user);
}

async function getUserById(id: number) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new CustomError('User not found.', HttpStatus.NOT_FOUND);
    throw error;
  }

  return filterSensitiveUserData(user);
}

async function updateUser(id: number, data: Partial<User>) {
  return await userRepository.update(id, data);
}

async function refreshToken(userId: number, refreshToken: string) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new CustomError('Unauthorized', HttpStatus.UNAUTHORIZED);
    throw error;
  }
  const accessToken = createToken(user.id, 'access'); // 변경
  const newRefreshToken = createToken(user.id, 'refresh'); // 추가
  return { accessToken, newRefreshToken };
}

async function oauthCreateOrUpdate(provider: string, providerId: string, email: string, nickname?: string) {
  const user = await userRepository.createOrUpdate(provider, providerId, email, nickname);
  return filterSensitiveUserData(user);
}

export default {
  hashingPassword,
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
  getUserById,
  oauthCreateOrUpdate,
};
