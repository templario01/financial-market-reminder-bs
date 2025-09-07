import { User } from '@prisma/client';
import { UserEntity } from '../../../domain/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserWithAccount } from '../../../../../core/database/types/user.type';
import { AccountEntityMapper } from '../../../../account-management/infrastructure/output/mappers/account-entity.mapper';

export class UserEntityMapper {
  static toEntity(user: User): UserEntity;
  static toEntity(user: UserWithAccount): UserEntity;

  static toEntity(user: User | UserWithAccount): UserEntity {
    return plainToInstance(UserEntity, {
      email: user.email,
      phoneNumber: user.phoneNumber,
      encryptedPassword: user.password,
      ...('account' in user &&
        user.account && {
          account: AccountEntityMapper.toEntity(user.account),
        }),
    } as UserEntity);
  }
}
