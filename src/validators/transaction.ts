import { AccountType, TransactionType } from '@prisma/client';
import { z } from 'zod';

export const transactionValidation = z
  .object({
    account: z.object({
      number: z.number().nonnegative(),
      branch: z.number().nonnegative().optional(),
      type: z.nativeEnum(AccountType).optional(),
    }),
    amount: z.number().nonnegative(),
    type: z.nativeEnum(TransactionType),
  })
  .required();

export type TransactionDto = z.infer<typeof transactionValidation>;
