import { User } from '@prisma/client';
import userService from '@services/user.service';
import { faker } from '@faker-js/faker';

const createUsers = async (amount: number): Promise<void> => {
  try {
    const users: Omit<User, 'id'>[] = Array.from({ length: amount }, () => ({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
    }));

    await Promise.all(users.map((user) => userService.createUser(user)));
  } catch (error) {
    console.error(`Erro ao criar usuários: \n${error}`);
  }
};

export default createUsers;
