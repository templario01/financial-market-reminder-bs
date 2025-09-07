import { AccountEntity } from '../../../account-management/domain/entities/account.entity';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hasActiveNotifications: boolean,
    public readonly encryptedPassword: string,
    public readonly isActive: boolean,
    public readonly phoneNumber: string | null,
    public readonly alias: string | null,
    public readonly account?: AccountEntity | null,
  ) {}
}
