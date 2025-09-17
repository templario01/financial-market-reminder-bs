import { Injectable, NotFoundException } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { AccountEntity } from '../domain/entities/account.entity';

@Injectable()
export class GetAccountInformationUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(accountId: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }
}
