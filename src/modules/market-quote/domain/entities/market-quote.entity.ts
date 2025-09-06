import { QuotePriceEntity } from './quote-price.entity';

export class QuoteEntity {
  constructor(
    public ticker: string,
    public description: string,
    public type: string,
    public id: string,
    public price?: QuotePriceEntity,
  ) {}
}

export type ExternalQuoteEntity = Omit<QuoteEntity, 'id' | 'price'>;
