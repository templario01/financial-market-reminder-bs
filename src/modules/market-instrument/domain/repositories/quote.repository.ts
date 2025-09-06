import { Injectable } from '@nestjs/common';
import {
  ExternalMarketQuoteEntity,
  MarketQuoteEntity,
} from '../entities/market-quote.entity';

@Injectable()
export abstract class QuoteRepository {
  abstract create(quote: ExternalMarketQuoteEntity): Promise<MarketQuoteEntity>;
  abstract findByTicker(ticker: string): Promise<MarketQuoteEntity | null>;
  abstract findManyByTickerFragment(word: string): Promise<MarketQuoteEntity[]>;
}
