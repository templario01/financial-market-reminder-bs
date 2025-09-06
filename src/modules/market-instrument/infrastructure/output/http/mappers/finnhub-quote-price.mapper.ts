import { plainToInstance } from 'class-transformer';
import { FinnhubQuoteDto } from '../dtos/finnhub-quote.response.dto';
import { MarketQuotePriceEntity } from '../../../../domain/entities/market-quote-price.entity';

export class FinnhubQuotePriceResponseMapper {
  static toEntity(dto: FinnhubQuoteDto): MarketQuotePriceEntity {
    return plainToInstance(MarketQuotePriceEntity, {
      currentPrice: dto.c,
      change: dto.d,
      percentChange: dto.dp,
      high: dto.h,
      low: dto.l,
      open: dto.o,
      previousClose: dto.pc,
      lastUpdated: new Date(dto.t),
    } as MarketQuotePriceEntity);
  }
}
