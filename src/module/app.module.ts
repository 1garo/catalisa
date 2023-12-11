import { Module } from '@nestjs/common';
import { AccountController } from '../controller/account.controller';
import { AccountService } from '../service/account.service';
import { TransactionService } from '../service/transaction.service';
import { PrismaService } from '../service/prisma.service';
import { TransactionController } from '../controller/transaction.controller';

@Module({
  imports: [],
  controllers: [AccountController, TransactionController],
  providers: [AccountService, TransactionService, PrismaService],
})
export class AppModule {}
