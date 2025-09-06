import { MarketQuotePriceEntity } from './market-quote-price.entity';

export class MarketQuoteEntity {
  constructor(
    public ticker: string,
    public description: string,
    public type: string,
    public id: string,
    public price?: MarketQuotePriceEntity,
  ) {}
}

export type ExternalMarketQuoteEntity = Omit<MarketQuoteEntity, 'id' | 'price'>;
