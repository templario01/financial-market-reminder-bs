import { Injectable } from '@nestjs/common';
import { ExternalQuoteEntity, QuoteEntity } from '../entities/quote.entity';

@Injectable()
export abstract class IQuoteRepository {
  abstract create(quote: ExternalQuoteEntity): Promise<QuoteEntity>;
  abstract findByTicker(ticker: string): Promise<QuoteEntity | null>;
  abstract findManyByTickerLetters(word: string): Promise<QuoteEntity[]>;
}
