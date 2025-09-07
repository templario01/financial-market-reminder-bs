import { Prisma } from '@prisma/client';

export type UserWithAccount = Prisma.UserGetPayload<{
  include: { account: true };
}>;
