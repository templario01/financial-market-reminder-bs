import { Quote } from '@prisma/client';
import { QuoteEntity } from '../../../../domain/entities/market-quote.entity';

export class PrismaQuoteMapper {
  static toEntity(prismaQuote: Quote): QuoteEntity {
    return new QuoteEntity(
      prismaQuote.id,
      prismaQuote.ticker,
      prismaQuote.description,
      prismaQuote.type,
    );
  }
}
