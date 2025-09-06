import { Injectable } from '@nestjs/common';
import { QuotePriceEntity } from '../entities/quote-price.entity';
import { ExternalQuoteEntity } from '../entities/market-quote.entity';

@Injectable()
export abstract class FinancialMarketRepository {
  abstract getQuotePrice(ticker: string): Promise<QuotePriceEntity>;
  abstract getQuoteInformation(
    ticker: string,
  ): Promise<ExternalQuoteEntity | null>;
}
