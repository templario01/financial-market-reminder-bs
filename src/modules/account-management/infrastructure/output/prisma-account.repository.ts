import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import {
  ScheduleExecuteDay,
  SchedulePeriod,
} from '../../../../core/common/enums/account.enum';
import {
  AccountEntity,
  UpdateAccountEntity,
} from '../../domain/entities/account.entity';
import { AccountEntityMapper } from './mappers/account-entity.mapper';
import { IAccountRepository } from '../../domain/repositories/account.repository';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async update(
    accountId: string,
    data: UpdateAccountEntity,
  ): Promise<AccountEntity> {
    await this.prismaService.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { alias: data.alias },
      });
      if (data.notificationSchedules) {
        for (const schedule of data.notificationSchedules) {
          await tx.notificationSchedule.upsert({
            where: {
              accountId_executionDay_period: {
                accountId: accountId,
                executionDay: ScheduleExecuteDay[schedule.executionDay],
                period: SchedulePeriod[schedule.period],
              },
            },
            update: {
              isActive: schedule.isActive,
              executionDay: ScheduleExecuteDay[schedule.executionDay],
              period: SchedulePeriod[schedule.period],
            },
            create: {
              isActive: schedule.isActive,
              executionDay: ScheduleExecuteDay[schedule.executionDay],
              period: SchedulePeriod[schedule.period],
              accountId: accountId,
            },
          });
        }
      }
    });

    const account = await this.prismaService.account.findUnique({
      where: { id: accountId },
      include: { notificationSchedules: true },
    });

    return AccountEntityMapper.toEntity(account!);
  }
}
