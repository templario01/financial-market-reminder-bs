import { QuoteEntity } from '../../../market-quote/domain/entities/quote.entity';

export abstract class IQuotePriceRepository {
  abstract createMany(quotes: QuoteEntity[]): Promise<void>;
}
