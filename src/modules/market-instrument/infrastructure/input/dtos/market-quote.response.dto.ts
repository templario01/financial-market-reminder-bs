import { Exclude } from 'class-transformer';
import { MarketQuotePriceResponseDto } from './market-quote-price.response.dto';

@Exclude()
export class MarketQuoteResponseDto {
  @Exclude()
  readonly id: string;
  @Exclude()
  readonly ticker: string;
  @Exclude()
  readonly description: string;
  @Exclude()
  readonly type: string;
  @Exclude()
  readonly price?: MarketQuotePriceResponseDto;
}
