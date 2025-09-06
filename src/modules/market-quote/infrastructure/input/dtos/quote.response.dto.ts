import { Exclude, Expose } from 'class-transformer';
import { QuotePriceResponseDto } from './quote-price.response.dto';

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
}
