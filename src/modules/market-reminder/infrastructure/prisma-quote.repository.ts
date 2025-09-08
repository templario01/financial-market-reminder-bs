import { Injectable } from '@nestjs/common';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';
import { PrismaService } from '../../../core/database/prisma.service';
import { QuoteEntityMapper } from '../../market-quote/infrastructure/output/persistence/mappers/quote-entity.mapper';

@Injectable()
export class PrismaQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<QuoteEntity[]> {
    const quotes = await this.prisma.quote.findMany();
    return quotes.map((quote) => QuoteEntityMapper.toEntity(quote));
  }
}
