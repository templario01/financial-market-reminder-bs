import { plainToInstance } from 'class-transformer';
import { AccountEntity } from '../../../domain/entities/account.entity';
import { Account } from '@prisma/client';
import { NotificationProvider } from '../../../../../core/common/enums/account.enum';
import { NotificationScheduleEntityMapper } from './notification-schedule.entity.mapper';
import { AccountWithRelations } from '../../../../../core/database/types/user.type';

export class AccountEntityMapper {
  static toEntity(data: Account): AccountEntity;
  static toEntity(data: AccountWithRelations): AccountEntity;
  static toEntity(data: Account | AccountWithRelations): AccountEntity {
    return plainToInstance(AccountEntity, {
      id: data.id,
      createdAt: data.createdAt,
      isActive: data.isActive,
      alias: data.alias,
      notificationProviders: [
        ...data.notificationProviders.map(
          (provider) => NotificationProvider[provider],
        ),
      ],
      notificationSchedules:
        'notificationSchedules' in data && data.notificationSchedules
          ? data.notificationSchedules.map((schedule) =>
              NotificationScheduleEntityMapper.toEntity(schedule),
            )
          : [],
      user: 'user' in data && data.user ? data.user : null,
      favoriteQuotes:
        'favoriteQuotes' in data && data.favoriteQuotes
          ? data.favoriteQuotes.map((favoriteQuote) => favoriteQuote.quoteId)
          : [],
      userId: data.userId,
    } as AccountEntity);
  }
}
