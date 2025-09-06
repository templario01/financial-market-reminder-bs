import { Injectable } from '@nestjs/common';
import { ExternalQuotePriceEntity } from '../entities/quote-price.entity';
import { ExternalQuoteEntity } from '../entities/quote.entity';

@Injectable()
export abstract class IFinancialMarketRepository {
  abstract getQuotePrice(ticker: string): Promise<ExternalQuotePriceEntity>;
  abstract getQuoteInformation(
    ticker: string,
  ): Promise<ExternalQuoteEntity | null>;
}
