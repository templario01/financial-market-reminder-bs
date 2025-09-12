import { Prisma } from '@prisma/client';

export type UserWithAccount = Prisma.UserGetPayload<{
  include: { account: true };
}>;

export type AccountsWithNotificationSchedules = Prisma.AccountGetPayload<{
  include: { notificationSchedules: true };
}>;
