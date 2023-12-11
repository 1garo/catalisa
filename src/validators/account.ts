import { AccountType } from '@prisma/client';
import { z } from 'zod';

export const updateAccountValidation = z
  .object({
    type: z.nativeEnum(AccountType),
    id: z.number(),
  })
  .required();

export const createAccountValidation = z
  .object({
    type: z.nativeEnum(AccountType),
  })
  .required();

export type UpdateAccountDto = z.infer<typeof updateAccountValidation>;
export type CreateAccountDto = z.infer<typeof createAccountValidation>;
