import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class TimeSerieElementQuoteResponseDto {
  @Expose()
  date: string;

  @Expose()
  open: number;

  @Expose()
  high: number;

  @Expose()
  low: number;

  @Expose()
  close: number;

  @Expose()
  volume: number;

  @Expose()
  adjustedClose?: number;

  @Expose()
  dividendAmount?: number;
}
