import {
  Controller,
  Post,
  HttpCode,
  Body,
  UsePipes,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { ZodValidationPipe } from '../validators';
import { TransactionDto, transactionValidation } from '../validators/transaction';
import { DefaultUrlParam, TransactionPagination } from '../typings';

@Controller()
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Post('/transaction')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(transactionValidation))
  createAccount(@Body() body: TransactionDto) {
    try {
      return this.appService.createTransaction(body);
    } catch (err) {
      console.error(err)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/transaction/:id')
  @HttpCode(200)
  getTransaction(@Param() params: DefaultUrlParam, @Query() query: {accountId: string}) {
    try {
      return this.appService.getTransaction(params, query);
    } catch (err) {
      console.error(err)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/transaction')
  @HttpCode(200)
  async getAll(
    @Query() query: TransactionPagination,
  ) {
    try {
      return this.appService.getAllTransaction(query);
    } catch (err) {
      console.error(err)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
