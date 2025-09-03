import { Injectable } from '@nestjs/common';
import { MarketQuoteEntity } from '../entities/market-quote.entity';

@Injectable()
export abstract class MarketQuoteRepository {
  abstract getQuote(ticker: string): Promise<MarketQuoteEntity>;
}
