import { Injectable } from '@nestjs/common';
import { MarketQuotePriceEntity } from '../entities/market-quote-price.entity';
import { ExternalMarketQuoteEntity } from '../entities/market-quote.entity';

@Injectable()
export abstract class FinancialMarketRepository {
  abstract getQuotePrice(ticker: string): Promise<MarketQuotePriceEntity>;
  abstract getQuoteInformation(
    ticker: string,
  ): Promise<ExternalMarketQuoteEntity | null>;
}
