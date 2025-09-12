import { NotificationProvider } from '../../../../core/common/enums/account.enum';
import {
  CreateNotificationScheduleEntity,
  NotificationScheduleEntity,
} from './notification-schedule.entity';

export class AccountEntity {
  constructor(
    public readonly id: string,
    public readonly isActive: boolean,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly notificationProviders?: NotificationProvider[] | null,
    public readonly notificationSchedules?: NotificationScheduleEntity[] | null,
    public readonly alias?: string | null,
  ) {}
}

export class UpdateAccountEntity {
  constructor(
    public readonly notificationProviders?: NotificationProvider[],
    public readonly notificationSchedules?: CreateNotificationScheduleEntity[],
    public readonly alias?: string | null,
  ) {}
}
