import { Injectable, Logger } from '@nestjs/common';
import { AccountEntity } from '../../account-management/domain/entities/account.entity';
import { MarketReportEntity } from '../domain/entities/market-report.entity';
import {
  ScheduleExecuteDay,
  SchedulePeriod,
} from '../../../core/common/enums/account.enum';
import { IMailerRepository } from '../../../core/common/modules/mail/domain/repositories/email-repository';
import { plainToInstance } from 'class-transformer';
import { SendEmailNotificationEntity } from '../../../core/common/modules/mail/domain/entities/send-email-notification.entity';

export type WeeklyExecutionDay =
  | ScheduleExecuteDay.EVERY_MONDAY
  | ScheduleExecuteDay.EVERY_TUESDAY
  | ScheduleExecuteDay.EVERY_WEDNESDAY
  | ScheduleExecuteDay.EVERY_THURSDAY
  | ScheduleExecuteDay.EVERY_FRIDAY
  | ScheduleExecuteDay.EVERY_SATURDAY
  | ScheduleExecuteDay.EVERY_SUNDAY;

@Injectable()
export class SendWeeklyReportToUserUseCase {
  private readonly logger = new Logger(SendWeeklyReportToUserUseCase.name);
  constructor(private readonly mailerRepository: IMailerRepository) {}

  async execute(
    account: AccountEntity,
    accountQuotes: string[],
    weeklyMarketReport: MarketReportEntity,
  ): Promise<void> {
    const weeklyNotificationSchedule = account.notificationSchedules?.find(
      (schedule) => schedule.period === SchedulePeriod.WEEKLY,
    );
    if (!weeklyNotificationSchedule) return;
    const isCurrentWeekDayEqualsToExecutionDay =
      this.compareWeekDayEqualsToExecutionDay(
        weeklyNotificationSchedule.executionDay as WeeklyExecutionDay,
      );
    if (!isCurrentWeekDayEqualsToExecutionDay) return;
    const accountWeeklyReportQuotes = weeklyMarketReport.quotes.filter(
      (quote) => accountQuotes?.includes(quote.ticker),
    );

    await this.mailerRepository.sendEmailNotification(
      plainToInstance(SendEmailNotificationEntity, {
        email: account.user?.email as string,
        fromName: 'Stock Reminder',
        subject: 'Reporte Semanal del Mercado',
        templateId: 'weeklyReportEmail',
        body: {
          ...weeklyMarketReport,
          quotes: accountWeeklyReportQuotes,
        },
      } as SendEmailNotificationEntity),
    );
  }

  private compareWeekDayEqualsToExecutionDay(
    executionDay?: WeeklyExecutionDay,
  ): boolean {
    if (!executionDay) return false;
    const dayMap: Record<WeeklyExecutionDay, number> = {
      [ScheduleExecuteDay.EVERY_MONDAY]: 1,
      [ScheduleExecuteDay.EVERY_TUESDAY]: 2,
      [ScheduleExecuteDay.EVERY_WEDNESDAY]: 3,
      [ScheduleExecuteDay.EVERY_THURSDAY]: 4,
      [ScheduleExecuteDay.EVERY_FRIDAY]: 5,
      [ScheduleExecuteDay.EVERY_SATURDAY]: 6,
      [ScheduleExecuteDay.EVERY_SUNDAY]: 0,
    };
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    return currentDayOfWeek === dayMap[executionDay];
  }
}
