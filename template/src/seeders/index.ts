import createUsers from './user';

const seed = async (): Promise<void> => {
  await Promise.all([
    createUsers(10),
    // Add more seeders here...
  ]);
};

seed();