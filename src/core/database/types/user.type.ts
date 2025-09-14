import { Prisma } from '@prisma/client';

export type UserWithAccount = Prisma.UserGetPayload<{
  include: { account: boolean };
}>;

export type AccountRelations = Pick<
  Prisma.AccountInclude,
  'notificationSchedules' | 'user' | 'favoriteQuotes'
>;

export type AccountWithRelations = Prisma.AccountGetPayload<{
  include: AccountRelations;
}>;
