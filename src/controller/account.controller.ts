import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  HttpCode,
  Body,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { Account } from '@prisma/client';
import { ZodValidationPipe } from '../validators';
import { CreateAccountDto, UpdateAccountDto, createAccount, updateAccount } from '../validators/account';

export interface DefaultUrlParam {
  id: string;
}

export interface Pagination {
  take: string;
  skip: string;
}

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Post('/account')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccount))
  createAccount(@Body() body: CreateAccountDto): Promise<{data: Account}> {
    return this.appService.createAccount(body);
  }

  @Get('/account/:id')
  @HttpCode(200)
  async getAccount(@Param() params: DefaultUrlParam): Promise<{data: Account}> {
    return this.appService.getAccount(params);
  }

  @Get('/account')
  @HttpCode(200)
  async getAll(@Query() query: Pagination): Promise<{data: Account[], count: number}>{
    return this.appService.getAllAccounts(query);
  }

  @Patch('/account')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateAccount))
  updateAccount(
    @Body() body: UpdateAccountDto
  ) {
    return this.appService.updateAccount(body);
  }

  @Delete('/account/:id')
  @HttpCode(204)
  deleteAccount(@Param() params: DefaultUrlParam) {
    return this.appService.deleteAccount(params);
  }
}
