import { Injectable } from '@nestjs/common';
import { AuthProviderEntity } from '../entities/auth-provider.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateUserEntity } from '../entities/create-user.entity';

@Injectable()
export abstract class IUserRepository {
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserByEmailIncludingAccount(
    email: string,
  ): Promise<UserEntity | null>;
  abstract createUser(data: CreateUserEntity): Promise<UserEntity>;
  abstract createUserByExternalProvider(
    email: string,
    authProvider: AuthProviderEntity,
  ): Promise<UserEntity>;
}
