import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MarketQuotePriceResponseDto {
  @Expose()
  currentPrice: number;

  @Expose()
  change: number;

  @Expose()
  percentChange: number;

  @Expose()
  high: number;

  @Expose()
  low: number;

  @Expose()
  open: number;

  @Expose()
  previousClose: number;
}
