import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { CreateUserEntity } from '../../auth/domain/entities/create-user.entity';
import { UserEntity } from '../../auth/domain/entities/user.entity';
import { AuthProviderEntity } from '../../auth/domain/entities/auth-provider.entity';
import { PrismaUserMapper } from '../../auth/infrastructure/output/mappers/prisma-user.mapper';

@Injectable()
export class PrismaUserFavoriteQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(data: CreateUserEntity): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.encryptedPassword,
        alias: data.alias,

        authProviders: [AuthProviderEntity.LOCAL],
      },
    });
    return PrismaUserMapper.toEntity(user);
  }
}
