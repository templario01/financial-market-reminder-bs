import { ExternalQuotePriceEntity } from '../../../market-quote/domain/entities/quote-price.entity';

export class CreateQuotePriceEntity {
  constructor(
    public quoteId: string,
    public price: ExternalQuotePriceEntity,
  ) {}
}
