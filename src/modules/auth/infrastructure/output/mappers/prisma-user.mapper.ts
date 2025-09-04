import { User } from '@prisma/client';
import { UserEntity } from '../../../domain/entities/user.entity';
import { plainToInstance } from 'class-transformer';

export class PrismaUserMapper {
  static toEntity(user: User): UserEntity {
    return plainToInstance(UserEntity, {
      email: user.email,
      alias: user.alias,
      isActive: user.isActive,
      hasActiveNotifications: user.hasActiveNotifications,
      phoneNumber: user.phoneNumber,
    } as UserEntity);
  }
}
