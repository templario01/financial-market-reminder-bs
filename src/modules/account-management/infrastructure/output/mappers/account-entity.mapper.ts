import { plainToInstance } from 'class-transformer';
import { AccountEntity } from '../../../domain/entities/account.entity';
import { Account } from '@prisma/client';

export class AccountEntityMapper {
  static toEntity(data: Account): AccountEntity {
    return plainToInstance(AccountEntity, {
      id: data.id,
      createdAt: data.createdAt,
      isActive: data.isActive,
      userId: data.userId,
      alias: data.alias,
    } as AccountEntity);
  }
}
