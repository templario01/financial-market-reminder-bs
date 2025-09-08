import { MetadataQuoteEntity } from './metadata-quote.entity';
import { TimeSerieElementQuoteEntity } from './time-serie-element-quote.entity';

export class QuoteTimeSerieEntity {
  constructor(
    public readonly metadata: MetadataQuoteEntity,
    public readonly elements: TimeSerieElementQuoteEntity[],
  ) {}
}
