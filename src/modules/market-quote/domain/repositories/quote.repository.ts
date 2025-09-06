import { Injectable } from '@nestjs/common';
import {
  ExternalQuoteEntity,
  QuoteEntity,
} from '../entities/market-quote.entity';

@Injectable()
export abstract class QuoteRepository {
  abstract create(quote: ExternalQuoteEntity): Promise<QuoteEntity>;
  abstract findByTicker(ticker: string): Promise<QuoteEntity | null>;
  abstract findManyByTickerLetters(word: string): Promise<QuoteEntity[]>;
}
