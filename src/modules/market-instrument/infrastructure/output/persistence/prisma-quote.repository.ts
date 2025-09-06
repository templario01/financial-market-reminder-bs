import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/database/prisma.service';
import { PrismaQuoteMapper } from './mappers/prisma-quote.mapper';
import { MarketQuoteEntity } from '../../../domain/entities/market-quote.entity';
import { QuoteRepository } from '../../../domain/repositories/quote.repository';

@Injectable()
export class PrismaQuoteRepository implements QuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(quote: MarketQuoteEntity): Promise<MarketQuoteEntity> {
    const newQuote = await this.prisma.quote.create({
      data: {
        description: quote.description,
        ticker: quote.ticker,
        type: quote.type,
      },
    });
    return PrismaQuoteMapper.toEntity(newQuote);
  }

  async findByTicker(ticker: string): Promise<MarketQuoteEntity | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { ticker },
    });
    return quote ? PrismaQuoteMapper.toEntity(quote) : null;
  }

  async findManyByTickerFragment(word: string): Promise<MarketQuoteEntity[]> {
    const quotes = await this.prisma.quote.findMany({
      where: {
        ticker: {
          contains: word,
          mode: 'insensitive',
        },
      },
    });
    return quotes.map((quote) => PrismaQuoteMapper.toEntity(quote));
  }
}
