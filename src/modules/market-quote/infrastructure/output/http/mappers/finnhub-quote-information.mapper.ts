import { FinnhubSymbolInformationDto } from '../dtos/finnhub-quote.response.dto';
import { ExternalQuoteEntity } from '../../../../domain/entities/quote.entity';

export class FinnhubQuoteInformationMapper {
  static toEntity(data: FinnhubSymbolInformationDto): ExternalQuoteEntity {
    return {
      ticker: data.symbol,
      description: data.description,
      type: data.type,
    };
  }
}
