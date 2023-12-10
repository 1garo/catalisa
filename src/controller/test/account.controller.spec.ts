import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../module/app.module';
import { PrismaService } from '../../service/prisma.service';
import { Account, AccountType } from '@prisma/client';
import { seedAccount } from './seed';

describe('Account integration tests', () => {
  let app: INestApplication;
  const prisma = new PrismaService();

  let account: Account;
  let accountToPatch: Account;
  let accountToDelete: Account;

  beforeAll(async () => {
    const seed = await seedAccount(prisma);
    account = seed.account;
    accountToDelete = seed.accountToDelete;
    accountToPatch = seed.accountToPatch;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const deleteAccount = prisma.account.deleteMany();

    await prisma.$transaction([deleteAccount]);

    await prisma.$disconnect();
  });

  it(`should succeed to create an account`, async () => {
    let response = await request(app.getHttpServer()).post('/account').send({
      type: 'Savings',
    });

    expect(response.status).toEqual(201);
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.data.type).toEqual(AccountType.Savings);
    expect(response.body.data.branch).toEqual(account.branch);
    expect(response.body.data.deletedAt).toBeNull();

    response = await request(app.getHttpServer()).post('/account').send({
      type: 'Checking',
    });

    expect(response.status).toEqual(201);
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.data.type).toEqual(AccountType.Checking);
    expect(response.body.data.branch).toEqual(account.branch);
    expect(response.body.data.deletedAt).toBeNull();
  });

  it(`should succeed to patch an account`, async () => {
    expect(accountToPatch.type).toEqual(AccountType.Savings);

    const response = await request(app.getHttpServer()).patch('/account').send({
      type: 'Checking',
      id: accountToPatch.id,
    });

    expect(response.status).toEqual(204);

    const acc = await prisma.account.findFirst({
      where: {
        id: accountToPatch.id,
      },
    });

    expect(acc.type).toEqual(AccountType.Checking);
    expect(acc.updatedAt).not.toEqual(accountToPatch.updatedAt);
  });

  it(`should succeed to delete an account`, async () => {
    const response = await request(app.getHttpServer()).delete(
      `/account/${accountToDelete.id}`,
    );

    expect(response.status).toEqual(204);

    const acc = await prisma.account.findFirst({
      where: {
        id: accountToDelete.id,
      },
    });

    expect(acc.deletedAt).not.toBeNull();
  });

  it(`should succeed to get account with :id`, async () => {
    const response = await request(app.getHttpServer()).get(
      `/account/${account.id}`,
    );

    expect(response.status).toEqual(200);
    expect(response.body.data.id).toEqual(account.id);
    expect(response.body.data.number).toEqual(account.number);
    expect(response.body.data.branch).toEqual(account.branch);
    expect(response.body.data.type).toEqual(account.type);
  });

  it(`should succeed to get all accounts`, async () => {
    const response = await request(app.getHttpServer()).get('/account');

    expect(response.status).toEqual(200);
    expect(response.body.count).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  it(`should error because :id is not found`, async () => {
    const response = await request(app.getHttpServer()).get(`/account/-1`);

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Account not found');
  });

  afterAll(async () => {
    await app.close();
  });
});
