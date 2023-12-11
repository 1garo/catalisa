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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { Account } from '@prisma/client';
import { ZodValidationPipe } from '../validators';
import {
  CreateAccountDto,
  UpdateAccountDto,
  createAccountValidation,
  updateAccountValidation,
} from '../validators/account';
import { DefaultUrlParam, Pagination } from '../typings';

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Post('/account')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountValidation))
  createAccount(@Body() body: CreateAccountDto): Promise<{ data: Account }> {
    try {
      return this.appService.createAccount(body);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/account/:id')
  @HttpCode(200)
  async getAccount(
    @Param() params: DefaultUrlParam,
  ): Promise<{ data: Account }> {
    return this.appService.getAccount(params);
  }

  @Get('/account')
  @HttpCode(200)
  async getAll(
    @Query() query: Pagination,
  ): Promise<{ data: Account[]; count: number }> {
    try {
      return this.appService.getAllAccounts(query);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/account')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateAccountValidation))
  updateAccount(@Body() body: UpdateAccountDto) {
    try {
      return this.appService.updateAccount(body);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/account/:id')
  @HttpCode(204)
  deleteAccount(@Param() params: DefaultUrlParam) {
    try {
      return this.appService.deleteAccount(params);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
