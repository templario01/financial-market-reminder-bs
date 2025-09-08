import { plainToInstance } from 'class-transformer';
import { MetadataQuoteEntity } from '../../../../domain/entities/metadata-quote.entity';
import { MetaData } from '../dtos/alphavantage.response.dto';

export class MetadataQuoteEntityMapper {
  static toEntity(metadata: MetaData): MetadataQuoteEntity {
    return plainToInstance(MetadataQuoteEntity, {
      information: metadata['1. Information'],
      symbol: metadata['2. Symbol'],
      lastRefreshed: metadata['3. Last Refreshed'],
      ...(metadata['5. Time Zone']
        ? {
            timeZone: metadata['5. Time Zone'],
            outputSize: metadata['4. Output Size'],
          }
        : {
            timeZone: metadata['4. Time Zone'],
          }),
    });
  }
}
