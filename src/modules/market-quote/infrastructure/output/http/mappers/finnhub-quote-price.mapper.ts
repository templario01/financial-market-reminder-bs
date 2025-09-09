import { plainToInstance } from 'class-transformer';
import { FinnhubQuoteDto } from '../dtos/finnhub-quote.response.dto';
import { ExternalQuotePriceEntity } from '../../../../domain/entities/quote-price.entity';

export class FinnhubQuotePriceResponseMapper {
  static toEntity(dto: FinnhubQuoteDto): ExternalQuotePriceEntity {
    return plainToInstance(ExternalQuotePriceEntity, {
      currentPrice: dto.c,
      change: dto.d,
      percentChange: dto.dp,
      high: dto.h,
      low: dto.l,
      open: dto.o,
      previousClose: dto.pc,
      lastUpdated: new Date(),
    } as ExternalQuotePriceEntity);
  }
}
