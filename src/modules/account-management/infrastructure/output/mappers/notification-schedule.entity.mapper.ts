import { NotificationSchedule } from '@prisma/client';
import { NotificationScheduleEntity } from '../../../domain/entities/notification-schedule.entity';
import { plainToInstance } from 'class-transformer';

export class NotificationScheduleEntityMapper {
  static toEntity(data: NotificationSchedule): NotificationScheduleEntity {
    return plainToInstance(NotificationScheduleEntity, {
      id: data.id,
      isActive: data.isActive,
      executionDay: data.executionDay,
      period: data.period,
    } as NotificationScheduleEntity);
  }
}
