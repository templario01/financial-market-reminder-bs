import {
  SchedulePeriod,
  ScheduleExecuteDay,
} from '../../../../core/common/enums/account.enum';

export class NotificationScheduleEntity {
  constructor(
    public id: string,
    public isActive: boolean,
    public executionDay: ScheduleExecuteDay,
    public period: SchedulePeriod,
  ) {}
}

export class CreateNotificationScheduleEntity {
  constructor(
    public isActive: boolean,
    public executionDay: ScheduleExecuteDay,
    public period: SchedulePeriod,
  ) {}
}
