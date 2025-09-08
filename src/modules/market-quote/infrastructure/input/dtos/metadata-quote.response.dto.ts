import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MetadataQuoteResponseDto {
  @Expose()
  information: string;

  @Expose()
  symbol: string;

  @Expose()
  lastRefreshed: string;

  @Expose()
  interval: string;

  @Expose()
  timeZone: string;

  @Expose()
  outputSize?: string | null;
}
