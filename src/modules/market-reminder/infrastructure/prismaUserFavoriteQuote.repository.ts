import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateUserEntity } from '../../auth/domain/entities/create-user.entity';
import { UserEntity } from '../../auth/domain/entities/user.entity';
import { AuthProviderEntity } from '../../auth/domain/entities/auth-provider.entity';
import { UserEntityMapper } from '../../auth/infrastructure/output/mappers/user-entity.mapper';

@Injectable()
export class PrismaUserFavoriteQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(data: CreateUserEntity): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.encryptedPassword,
        authProviders: [AuthProviderEntity.LOCAL],
      },
    });
    return UserEntityMapper.toEntity(user);
  }
}
