import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { AccountEntity } from '../../account-management/domain/entities/account.entity';
import { AccountEntityMapper } from '../../account-management/infrastructure/output/mappers/account-entity.mapper';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAccountsWithNotificationSchedules(): Promise<AccountEntity[]> {
    const accounts = await this.prismaService.account.findMany({
      where: {
        notificationSchedules: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        notificationSchedules: {
          where: { isActive: true },
        },
        user: true,
      },
    });

    return accounts.map((account) => AccountEntityMapper.toEntity(account));
  }
}
