import { AdjustedTimeSerieElementQuoteEntity } from './adjusted-time-serie-element-quote.entity';
import { MetadataQuoteEntity } from './metadata-quote.entity';
import { TimeSerieElementQuoteEntity } from './time-serie-element-quote.entity';

export class QuoteTimeSerieEntity {
  constructor(
    public readonly metadata: MetadataQuoteEntity,
    public readonly elements:
      | TimeSerieElementQuoteEntity[]
      | AdjustedTimeSerieElementQuoteEntity[],
  ) {}
}
