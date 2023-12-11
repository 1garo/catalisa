import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../module/app.module';
import { PrismaService } from '../../service/prisma.service';
import { Account, Transaction } from '@prisma/client';

describe('Transaction integration tests', () => {
  let app: INestApplication;
  const prisma = new PrismaService();

  let acc: Account;
  let tx: Transaction;

  beforeAll(async () => {
    acc = await prisma.account.create({
      data: {
        number: 100011111,
        branch: 1001,
        type: 'Savings',
        balance: 10 * 100, // balance in cents
      },
    });

    tx = await prisma.transaction.create({
      data: {
        accountId: acc.id,
        amount: 10 * 100,
        type: "Deposit"
      }
    })

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const deleteAccount = prisma.account.deleteMany();
    const deleteTransactions = prisma.transaction.deleteMany();

    await prisma.$transaction([
      deleteAccount,
      deleteTransactions
    ]);

    await prisma.$disconnect();
    await app.close();
  });

  it(`should succeed to get a transaction`, async () => {
    const response = await request(app.getHttpServer())
    .get(`/transaction/${tx.id}`)
    .query({accountId: acc.id})

    expect(response.status).toEqual(200);
    expect(response.body.data.id).toEqual(tx.id);
    expect(response.body.data.accountId).toEqual(acc.id);
  });

  it(`should succeed to get all transactions`, async () => {
    const response = await request(app.getHttpServer())
    .get(`/transaction`)
    .query({accountId: acc.id, take: 1})

    expect(response.status).toEqual(200);
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.length).toBe(1);
    expect(response.body.count).not.toBeNull();
  });

  it(`should succeed to create a deposit transaction`, async () => {
    const response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": acc.number
      },
      "amount": 10,
      "type": "Deposit"
    });

    expect(response.status).toEqual(201);
    expect(response.body.txid).not.toBeNull();
  });

  it(`should succeed to create a withdraw transaction`, async () => {
    const response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": acc.number
      },
      "amount": 5,
      "type": "Withdraw"
    });

    expect(response.status).toEqual(201);
    expect(response.body.txid).not.toBeNull();
  });

  it(`should error because balance is not enough to withdraw`, async () => {
    const response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": acc.number
      },
      "amount": 1000,
      "type": "Withdraw"
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Account balance is not enough");
  });

  it(`should error because account is not found`, async () => {
    const response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": 12222222
      },
      "amount": 1000,
      "type": "Withdraw"
    });

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual("Account not found");
  });

  it(`should error because schema validation failed`, async () => {
    let response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {},
      "amount": 1000,
      "type": "Withdraw"
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Validation failed");
    expect(response.body.error).toEqual("Bad Request");

    response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": acc.number
      },
      "type": "Withdraw"
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Validation failed");
    expect(response.body.error).toEqual("Bad Request");

    response = await request(app.getHttpServer())
    .post('/transaction')
    .send({
      "account": {
        "number": acc.number
      },
      "amount": 1000
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Validation failed");
    expect(response.body.error).toEqual("Bad Request");
  });

  it(`should error because transaction is not found`, async () => {
    const response = await request(app.getHttpServer())
    .get(`/transaction/-1000`)
    .query({accountId: acc.id})

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual("Transaction not found");
  });
});
