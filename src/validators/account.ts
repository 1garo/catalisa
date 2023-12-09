import { AccountType } from '@prisma/client';
import { z } from 'zod';

export const updateAccount = z.object({
  type: z.nativeEnum(AccountType),
  id: z.number(),
}).required();

export const createAccount = z.object({
  type: z.nativeEnum(AccountType),
}).required();

export type UpdateAccountDto = z.infer<typeof updateAccount>;
export type CreateAccountDto = z.infer<typeof createAccount>;
