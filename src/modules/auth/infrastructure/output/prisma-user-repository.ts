import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { AuthProviderEntity } from '../../domain/entities/auth-provider.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserEntityMapper } from './mappers/user-entity.mapper';
import { CreateUserEntity } from '../../domain/entities/create-user.entity';
import { AuthProvider } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserEntity): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.encryptedPassword,
        account: {
          create: {},
        },
        authProviders: [AuthProviderEntity.LOCAL],
      },
    });
    return UserEntityMapper.toEntity(user);
  }

  async createUserByExternalProvider(
    email: string,
    authProvider: AuthProviderEntity,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email,
        account: {
          create: {},
        },
        authProviders: [AuthProvider[AuthProviderEntity[authProvider]]],
      },
      include: { account: true },
    });
    return UserEntityMapper.toEntity(user);
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

    return user ? UserEntityMapper.toEntity(user) : null;
  }

  async findUserByEmailIncludingAccount(
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        account: true,
      },
    });

    return user ? UserEntityMapper.toEntity(user) : null;
  }
}
