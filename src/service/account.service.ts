import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { DefaultUrlParam, Pagination } from 'src/controller/account.controller';
import { PrismaService } from './prisma.service';
import { CreateAccountDto, UpdateAccountDto } from 'src/validators/account';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getAllAccounts({ take, skip }: Pagination) {
    const [accounts, count] = await this.prisma.$transaction([
      this.prisma.account.findMany({
        take: Number(take) || 20,
        skip: Number(skip) || 0,
      }),
      this.prisma.account.count(),
    ]);

    return {
      data: accounts,
      count,
    };
  }

  async getAccount({ id }: DefaultUrlParam): Promise<{ data: Account }> {
    const account = await this.prisma.account.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: account,
    };
  }

  async createAccount({ type }: CreateAccountDto): Promise<{ data: Account }> {
    const defaultBranch = 1001;
    const defaultNumber = 100000000;
    const defaultBalance = 0;
    const accounts = await this.prisma.account.count();
    const number = defaultNumber + (accounts + 1);

    const account = await this.prisma.account.create({
      data: {
        number,
        type,
        branch: defaultBranch,
        balance: defaultBalance,
      },
    });

    return {
      data: account,
    };
  }

  async deleteAccount({ id }: DefaultUrlParam) {
    const nid = Number(id);

    const account = await this.prisma.account.findUnique({
      where: {
        id: nid,
      },
    });

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
