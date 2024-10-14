import prisma from '@config/prisma';

const resetDb = async () => {
  await Promise.all([
    prisma.user.deleteMany(),
    // Add more deleteMany() calls here
  ]);
};

resetDb();