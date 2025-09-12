import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import {
  AccountEntity,
  UpdateAccountEntity,
} from '../domain/entities/account.entity';

@Injectable()
export class UpdateAccountSettingsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    accountId: string,
    data: UpdateAccountEntity,
  ): Promise<AccountEntity> {
    return this.accountRepository.update(accountId, data);
  }
}
