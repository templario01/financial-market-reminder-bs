import { TimeSerieElementQuoteEntity } from './time-serie-element-quote.entity';

export class AdjustedTimeSerieElementQuoteEntity extends TimeSerieElementQuoteEntity {
  adjustedClose: number;
  dividendAmount: number;
}
