import { plainToInstance } from 'class-transformer';
import { AccountEntity } from '../../../domain/entities/account.entity';
import { Account } from '@prisma/client';
import { NotificationProvider } from '../../../../../core/common/enums/account.enum';
import { NotificationScheduleEntityMapper } from './notification-schedule.entity.mapper';
import { AccountsWithNotificationSchedules } from '../../../../../core/database/types/user.type';

export class AccountEntityMapper {
  static toEntity(data: Account): AccountEntity;
  static toEntity(data: AccountsWithNotificationSchedules): AccountEntity;
  static toEntity(
    data: Account | AccountsWithNotificationSchedules,
  ): AccountEntity {
    return plainToInstance(AccountEntity, {
      id: data.id,
      createdAt: data.createdAt,
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
      isActive: data.isActive,
      userId: data.userId,
      alias: data.alias,
    } as AccountEntity);
  }
}
