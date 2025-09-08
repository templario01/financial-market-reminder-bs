import { Exclude, Expose } from 'class-transformer';
import { QuotePriceResponseDto } from './quote-price.response.dto';
import { QuoteTimeSerieResponseDto } from './quote-time-serie.response.dto';
import { StockRecommendationResponseDto } from './stock-recommendation.response';

@Exclude()
export class QuoteResponseDto {
  @Expose()
  readonly id: string;
  @Expose()
  readonly ticker: string;
  @Expose()
  readonly description: string;
  @Expose()
  readonly type: string;
  @Expose()
  readonly imageUrl?: string | null;
  @Expose()
  readonly price?: QuotePriceResponseDto;
  @Expose()
  readonly dailyTimeserie?: QuoteTimeSerieResponseDto;
  @Expose()
  readonly weeklyTimeserie?: QuoteTimeSerieResponseDto;
  @Expose()
  readonly monthlyTimeserie?: QuoteTimeSerieResponseDto;
  @Expose()
  readonly recommendations?: StockRecommendationResponseDto[];
}
