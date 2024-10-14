import { User } from '@prisma/client';

export type IUserWithPassword = Omit<User, 'password'>