import { Exclude, Expose } from 'class-transformer';
import { NotificationProvider } from '../../../../../core/common/enums/account.enum';
import { NotificationScheduleResponseDto } from './notification-schedule.response';

@Exclude()
export class AccountResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  notificationProviders?: NotificationProvider[] | null;

  @Expose()
  notificationSchedules?: NotificationScheduleResponseDto[] | null;

  @Expose()
  alias?: string | null;
}
