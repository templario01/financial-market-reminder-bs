import { Exclude, Expose, Type } from 'class-transformer';
import { CreateNotificationScheduleRequestDto } from './create-notification-schedule.request.dto';
import { NotificationProvider } from '../../../../../core/common/enums/account.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateAccountRequestDto {
  @Expose()
  @IsEnum(NotificationProvider, { each: true })
  notificationProviders?: NotificationProvider[];

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationScheduleRequestDto)
  notificationSchedules?: CreateNotificationScheduleRequestDto[];

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  alias?: string | null;
}
