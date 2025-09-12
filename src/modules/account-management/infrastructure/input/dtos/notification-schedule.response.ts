import { Exclude, Expose } from 'class-transformer';
import { CreateNotificationScheduleRequestDto } from './create-notification-schedule.request.dto';

@Exclude()
export class NotificationScheduleResponseDto extends CreateNotificationScheduleRequestDto {
  @Expose()
  id: string;
}
