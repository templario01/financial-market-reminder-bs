import { FinnhubSymbolInformationDto } from '../dtos/finnhub-quote.response.dto';
import { ExternalMarketQuoteEntity } from '../../../../domain/entities/market-quote.entity';

export class FinnhubQuoteInformationMapper {
  static toEntity(
    data: FinnhubSymbolInformationDto,
  ): ExternalMarketQuoteEntity {
    return {
      ticker: data.symbol,
      description: data.description,
      type: data.type,
    };
  }
}
