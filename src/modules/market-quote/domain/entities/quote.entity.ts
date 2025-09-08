import { QuotePriceEntity } from './quote-price.entity';
import { StockRecommendationEntity } from './stock-recommendation.entity';
import { QuoteTimeSerieEntity } from './time-serie-quote.entity';

export class QuoteEntity {
  constructor(
    public id: string,
    public ticker: string,
    public description: string,
    public type: string,
    public price?: QuotePriceEntity,
    public imageUrl?: string | null,
    public dailyTimeserie?: QuoteTimeSerieEntity,
    public weeklyTimeserie?: QuoteTimeSerieEntity,
    public monthlyTimeserie?: QuoteTimeSerieEntity,
    public recommendations?: StockRecommendationEntity[],
  ) {}
}

export type ExternalQuoteEntity = Omit<QuoteEntity, 'id' | 'price'>;
