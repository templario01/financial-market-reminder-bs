import { plainToInstance } from 'class-transformer';
import { FinnhubQuoteDto } from '../dtos/finnhub-quote.response.dto';
import { QuotePriceEntity } from '../../../../domain/entities/quote-price.entity';

export class FinnhubQuotePriceResponseMapper {
  static toEntity(dto: FinnhubQuoteDto): QuotePriceEntity {
    return plainToInstance(QuotePriceEntity, {
      currentPrice: dto.c,
      change: dto.d,
      percentChange: dto.dp,
      high: dto.h,
      low: dto.l,
      open: dto.o,
      previousClose: dto.pc,
      lastUpdated: new Date(dto.t),
    } as QuotePriceEntity);
  }
}
