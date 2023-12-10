import { Module } from '@nestjs/common';
import { AccountController } from '../controller/account.controller';
import { AccountService } from '../service/account.service';
import { PrismaService } from '../service/prisma.service';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AppModule {}
