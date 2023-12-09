import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../service/account.service';
import { PrismaService } from '../service/prisma.service';

describe('AccountController', () => {
  let appController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService, PrismaService],
    }).compile();

    appController = app.get<AccountController>(AccountController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getAccount({ id: '0' })).not.toBe('Hello World!');
    });
  });
});
