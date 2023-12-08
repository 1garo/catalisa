import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  HttpCode,
  Body,
} from '@nestjs/common';
import { AppService } from '../service/app.service';
import { Account, Prisma } from '@prisma/client';

export interface DefaultUrlParam {
  id: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/account')
  createAccount(): Promise<Account | null> {
    return this.appService.createAccount();
  }

  @Get('/account/:id')
  async getAccount(@Param() params: DefaultUrlParam): Promise<Account | null> {
    return this.appService.getAccount(params);
  }

  @Patch('/account/:id')
  @HttpCode(204)
  updateAccount(
    @Body() body: Prisma.AccountUpdateInput,
    @Param() params: DefaultUrlParam,
  ) {
    // TODO: validate body
    return this.appService.updateAccount(body, params);
  }

  @Delete('/account/:id')
  @HttpCode(204)
  deleteAccount(@Param() params: DefaultUrlParam) {
    return this.appService.deleteAccount(params);
  }
}
