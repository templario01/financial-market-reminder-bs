import { Exclude, Expose } from 'class-transformer';
import {
  ScheduleExecuteDay,
  SchedulePeriod,
} from '../../../../../core/common/enums/account.enum';
import { IsBoolean, IsEnum } from 'class-validator';

@Exclude()
export class CreateNotificationScheduleRequestDto {
  @IsBoolean()
  @Expose()
  isActive: boolean;

  @IsEnum(ScheduleExecuteDay)
  @Expose()
  executionDay: ScheduleExecuteDay;

  @IsEnum(SchedulePeriod)
  @Expose()
  period: SchedulePeriod;
}
