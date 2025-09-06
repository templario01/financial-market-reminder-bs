import { Quote } from '@prisma/client';
import { QuoteEntity } from '../../../../domain/entities/quote.entity';
import { plainToInstance } from 'class-transformer';

export class QuoteEntityMapper {
  static toEntity(data: Quote): QuoteEntity {
    return plainToInstance(QuoteEntity, {
      id: data.id,
      ticker: data.ticker,
      description: data.description,
      type: data.type,
    } as QuoteEntity);
  }
}
