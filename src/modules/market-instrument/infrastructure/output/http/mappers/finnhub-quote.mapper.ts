import { plainToInstance } from 'class-transformer';
import { FinnhubQuoteDto } from '../dtos/finnhub-quote.response.dto';
import { MarketQuoteEntity } from '../../../../domain/entities/market-quote.entity';

export class FinnhubQuoteResponseMapper {
  static toEntity(dto: FinnhubQuoteDto): MarketQuoteEntity {
    return plainToInstance(MarketQuoteEntity, {
      currentPrice: dto.c,
      change: dto.d,
      percentChange: dto.dp,
      high: dto.h,
      low: dto.l,
      open: dto.o,
      previousClose: dto.pc,
      lastUpdated: new Date(dto.t),
    } as MarketQuoteEntity);
  }
}
