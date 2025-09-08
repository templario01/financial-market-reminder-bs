import { Expose, Exclude, Type } from 'class-transformer';
import { MetadataQuoteResponseDto } from './metadata-quote.response.dto';
import { TimeSerieElementQuoteResponseDto } from './time-serie-element-quote.response.dto';

@Exclude()
export class QuoteTimeSerieResponseDto {
  @Expose()
  @Type(() => MetadataQuoteResponseDto)
  metadata: MetadataQuoteResponseDto;

  @Expose()
  @Type(() => TimeSerieElementQuoteResponseDto)
  elements: TimeSerieElementQuoteResponseDto[];
}
