import { Injectable } from '@nestjs/common';
import { ExternalQuotePriceEntity } from '../entities/quote-price.entity';
import { ExternalQuoteEntity } from '../entities/quote.entity';
import { StockRecommendationEntity } from '../entities/stock-recommendation.entity';

@Injectable()
export abstract class IFinancialMarketRepository {
  abstract getQuotePrice(ticker: string): Promise<ExternalQuotePriceEntity>;
  abstract getQuoteInformation(
    ticker: string,
  ): Promise<ExternalQuoteEntity | null>;
  abstract getRecommendation(
    stock: string,
  ): Promise<StockRecommendationEntity[]>;
}
