import { Quote } from '@prisma/client';
import { MarketQuoteEntity } from '../../../../domain/entities/market-quote.entity';

export class PrismaQuoteMapper {
  static toEntity(prismaQuote: Quote): MarketQuoteEntity {
    return new MarketQuoteEntity(
      prismaQuote.id,
      prismaQuote.ticker,
      prismaQuote.description,
      prismaQuote.type,
    );
  }
}
