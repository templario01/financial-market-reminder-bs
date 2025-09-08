import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class StockRecommendationResponseDto {
  @Expose()
  symbol: string;

  @Expose()
  period: string;

  @Expose()
  buy: number;

  @Expose()
  hold: number;

  @Expose()
  sell: number;

  @Expose()
  strongBuy: number;

  @Expose()
  strongSell: number;
}
