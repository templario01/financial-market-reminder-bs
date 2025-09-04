import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { AuthProviderEntity } from '../../domain/entities/auth-provider.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { PrismaUserMapper } from './mappers/prisma-user.mapper';
import { CreateUserEntity } from '../../domain/entities/create-user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserEntity): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.encryptedPassword,
        alias: data.alias,
        hasActiveNotifications: data.hasActiveNotifications,
        authProviders: [AuthProviderEntity.LOCAL],
      },
    });
    return PrismaUserMapper.toEntity(user);
  }

  async createUserByExternalProvider(
    email: string,
    authProvider: AuthProviderEntity,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email,
        authProviders: [AuthProviderEntity[authProvider]],
      },
    });
    return PrismaUserMapper.toEntity(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    return user ? PrismaUserMapper.toEntity(user) : null;
  }
}
