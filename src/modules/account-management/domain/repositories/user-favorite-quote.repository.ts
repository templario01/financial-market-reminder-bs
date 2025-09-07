import { Injectable } from '@nestjs/common';
import { QuoteEntity } from '../../../market-quote/domain/entities/quote.entity';

@Injectable()
export abstract class IAccountFavoriteQuoteRepository {
  abstract save(userId: string, quoteId: string): Promise<void>;
  abstract remove(userId: string, quoteId: string): Promise<void>;
  abstract findFavoriteQuotesByAccountId(
    accountId: string,
  ): Promise<QuoteEntity[]>;
}
