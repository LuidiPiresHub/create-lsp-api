import { User } from '@prisma/client';

export const omitPassword = (obj: User): Omit<User, 'password'> => {
  const { password, ...rest } = obj;
  return rest;
};