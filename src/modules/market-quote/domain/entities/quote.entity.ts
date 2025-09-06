import { QuotePriceEntity } from './quote-price.entity';

export class QuoteEntity {
  constructor(
    public id: string,
    public ticker: string,
    public description: string,
    public type: string,
    public imageUrl?: string | null,
    public price?: QuotePriceEntity,
  ) {}
}

export type ExternalQuoteEntity = Omit<QuoteEntity, 'id' | 'price'>;
