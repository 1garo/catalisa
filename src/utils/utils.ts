import { Account } from '@prisma/client';
import { PrismaService } from '../service/prisma.service';

export const findAccount = async (
  prisma: PrismaService,
  id: string,
): Promise<Account | null> => {
  const account = await prisma.account.findUnique({
    where: {
      id: Number(id),
      deletedAt: null,
    },
  });

  if (account === null) {
    return null;
  }

  return account;
};

export const findAccountByNumber = async (
  prisma: PrismaService,
  number: number,
): Promise<Account | null> => {
  if (number === null) {
    return null;
  }

  const account = await prisma.account.findUnique({
    where: {
      number,
      deletedAt: null,
    },
  });

  if (account === null) {
    return null;
  }

  return account;
};
