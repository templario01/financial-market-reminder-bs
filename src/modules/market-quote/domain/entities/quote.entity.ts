import { QuotePriceEntity } from './quote-price.entity';
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
  ) {}
}

export type ExternalQuoteEntity = Omit<QuoteEntity, 'id' | 'price'>;
