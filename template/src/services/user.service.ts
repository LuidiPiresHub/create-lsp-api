import prisma from '@config/prisma';
import { hash } from 'bcrypt';
import { IService } from '@interfaces/service.interface';
import { PrismaError } from '@interfaces/prisma.interface';
import { User } from '@prisma/client';
import { IUserWithPassword } from '@interfaces/user.interface';
import { omitPassword } from '@utils/omitPassword';

const ROUNDS = 10;

const getUsers = async (): Promise<IService<IUserWithPassword[]>> => {
  const users = await prisma.user.findMany();
  return { type: 'OK', message: users.map(omitPassword) }; 
};

const getUserById = async (id: number): Promise<IService<IUserWithPassword | string>> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { type: 'NOT_FOUND', message: 'User not found' };
  return { type: 'OK', message: omitPassword(user) };
};

const createUser = async (data: Omit<User, 'id'>): Promise<IService<IUserWithPassword | string>> => {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: await hash(data.password, ROUNDS),
      }
    });
    return { type: 'OK', message: omitPassword(user) };
  } catch (error) {
    const err = error as PrismaError;
    if (err.code === 'P2002') {
      return { type: 'CONFLICT', message: 'Email already exists' };
    }
    throw error;
  }
};

const updateUser = async (id: number, data: Partial<User>): Promise<IService<IUserWithPassword>> => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      name: data.name,
      password: data.password && await hash(data.password, ROUNDS),
    }
  });
  return { type: 'OK', message: omitPassword(user) };
};

const deleteUser = async (id: number): Promise<IService<IUserWithPassword | string>> => {
  try {
    const user = await prisma.user.delete({ where: { id } });
    return { type: 'OK', message: omitPassword(user) };
  } catch (error) {
    const err = error as PrismaError;
    if (err.code === 'P2025') {
      return { type: 'NOT_FOUND', message: 'User not found or already deleted' };
    }
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};