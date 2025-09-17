import { Injectable } from '@nestjs/common';
import { AccountEntity, UpdateAccountEntity } from '../entities/account.entity';

@Injectable()
export abstract class IAccountRepository {
  abstract update(
    accountId: string,
    data: UpdateAccountEntity,
  ): Promise<AccountEntity>;
  abstract getAccountsWithRelations(): Promise<AccountEntity[]>;
  abstract findById(accountId: string): Promise<AccountEntity | null>;
}
