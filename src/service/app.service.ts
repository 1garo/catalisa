import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account, AccountType, Prisma } from '@prisma/client';
import { DefaultUrlParam } from 'src/controller/app.controller';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getAccount({id}: DefaultUrlParam): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        id: Number(id),
      }
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return account

  }

  createAccount(): Promise<Account | null>{
    return this.prisma.account.create({
      data: {
        number: 0,
        branch: 0,
        balance: 0,
        type: AccountType.Checking
      }
    });
  }

  async deleteAccount({id}: DefaultUrlParam) {
    const nid = Number(id)

    const account = await this.prisma.account.findUnique({
      where: {
        id: nid,
      }
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.account.delete({
      where: {
        id: nid,
      }
    })
  }

  async updateAccount(body: Prisma.AccountUpdateInput, {id}: DefaultUrlParam) {
    const nid = Number(id);
    const account = await this.prisma.account.findUnique({
      where: {
        id: nid,
      }
    });

    if (account === null) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.account.update({
      where: {
        id: nid,
      },
      data: {
        ...body,
      }
    })
  }
}
