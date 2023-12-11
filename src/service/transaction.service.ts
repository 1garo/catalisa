import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionDto } from '../validators/transaction';
import { TransactionType } from '@prisma/client';
import { DefaultUrlParam, TransactionPagination } from '../typings';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getAllTransaction({ take, skip, accountId }: TransactionPagination) {
    const accId = Number(accountId);
    const [transactionQuantity, count] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: {
          accountId: accId,
        },
        take: Number(take) || 20,
        skip: Number(skip) || 0,
      }),
      this.prisma.transaction.count({
        where: {
          accountId: accId,
        },
      }),
    ]);

    return {
      data: transactionQuantity,
      count,
    };
  }

  async getTransaction(params: DefaultUrlParam, query: { accountId: string }) {
    const txid = Number(params.id);

    const tx = await this.prisma.transaction.findUnique({
      where: {
        id: txid,
        accountId: Number(query.accountId),
      },
    });

    if (tx === null) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: tx,
    };
  }
  async createTransaction(body: TransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: {
        number: body.account.number,
        branch: body.account.branch,
        type: body.account.type,
        deletedAt: null,
      },
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    let amountInCents = body.amount * 100;
    if (body.type === TransactionType.Withdraw) {
      if (account.balance < amountInCents) {
        throw new HttpException(
          `Account balance (${
            account.balance / 100
          }) is lower than wanted amount (${body.amount})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      amountInCents = -amountInCents;
    }

    const { id: txid } = await this.prisma.transaction.create({
      data: {
        amount: amountInCents,
        type: body.type,
        accountId: account.id,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: account.balance + amountInCents,
      },
    });

    return {
      txid,
    };
  }
}
