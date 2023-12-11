import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { DefaultUrlParam, Pagination } from '../typings';
import { PrismaService } from './prisma.service';
import { CreateAccountDto, UpdateAccountDto } from '../validators/account';
import { findAccount } from '../utils/utils';

const DEFAULT_BRANCH = 1001;
const DEFAULT_NUMBER = 100000000;
const DEFAULT_BALANCE = 0;

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getAllAccounts({ take, skip }: Pagination) {
    const [accountsQuantity, count] = await this.prisma.$transaction([
      this.prisma.account.findMany({
        take: Number(take) || 20,
        skip: Number(skip) || 0,
      }),
      this.prisma.account.count(),
    ]);

    return {
      data: accountsQuantity,
      count,
    };
  }

  async getAccount({ id }: DefaultUrlParam): Promise<{ data: Account }> {
    const account = await findAccount(this.prisma, id);

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: account,
    };
  }

  async createAccount({ type }: CreateAccountDto): Promise<{ data: Account }> {
    const accountsQuantity = await this.prisma.account.count();
    const number = DEFAULT_NUMBER + (accountsQuantity + 1);

    const account = await this.prisma.account.create({
      data: {
        number,
        type,
        branch: DEFAULT_BRANCH,
        balance: DEFAULT_BALANCE,
      },
    });

    return {
      data: account,
    };
  }

  async deleteAccount({ id }: DefaultUrlParam) {
    const nid = Number(id);

    const account = await findAccount(this.prisma, id);

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.account.update({
      where: {
        id: nid,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateAccount({ id, type }: UpdateAccountDto) {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        type,
      },
    });
  }
}
