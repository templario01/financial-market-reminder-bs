import { Injectable } from '@nestjs/common';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';
import { IAccountFavoriteQuoteRepository } from '../domain/repositories/user-favorite-quote.repository';

@Injectable()
export class GetFavoriteQuotesUseCase {
  constructor(
    private readonly accountFavoriteQuoteRepository: IAccountFavoriteQuoteRepository,
  ) {}
  async execute(accountId: string): Promise<QuoteEntity[]> {
    return this.accountFavoriteQuoteRepository.findFavoriteQuotesByAccountId(
      accountId,
    );
  }
}
