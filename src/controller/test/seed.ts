import { PrismaService } from '../../service/prisma.service';

export const seedAccount = async (conn: PrismaService) => {
  const account = await conn.account.create({
    data: {
      number: 100000001,
      branch: 1001,
      type: 'Savings',
      balance: 0,
    },
  });

  const accountToPatch = await conn.account.create({
    data: {
      number: 100000002,
      branch: 1001,
      type: 'Savings',
      balance: 0,
    },
  });

  const accountToDelete = await conn.account.create({
    data: {
      number: 100000003,
      branch: 1001,
      type: 'Savings',
      balance: 0,
    },
  });

  return {
    account,
    accountToDelete,
    accountToPatch,
  };
};
