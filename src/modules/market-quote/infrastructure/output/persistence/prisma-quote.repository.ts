import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/database/prisma.service';
import { QuoteEntityMapper } from './mappers/quote-entity.mapper';
import {
  ExternalQuoteEntity,
  QuoteEntity,
} from '../../../domain/entities/quote.entity';
import { IQuoteRepository } from '../../../domain/repositories/quote.repository';

@Injectable()
export class PrismaQuoteRepository implements IQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QuoteEntity | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });
    return quote ? QuoteEntityMapper.toEntity(quote) : null;
  }

  async create(quote: ExternalQuoteEntity): Promise<QuoteEntity> {
    const newQuote = await this.prisma.quote.create({
      data: {
        imageUrl: quote.imageUrl,
        description: quote.description,
        ticker: quote.ticker,
        type: quote.type,
      },
    });
    return QuoteEntityMapper.toEntity(newQuote);
  }

  async findByTicker(ticker: string): Promise<QuoteEntity | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { ticker },
    });
    return quote ? QuoteEntityMapper.toEntity(quote) : null;
  }

  async findManyByTickerLetters(word: string): Promise<QuoteEntity[]> {
    const quotes = await this.prisma.quote.findMany({
      where: {
        ticker: {
          contains: word,
          mode: 'insensitive',
        },
      },
    });
    return quotes.map((quote) => QuoteEntityMapper.toEntity(quote));
  }
}
