import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateQuotePriceEntity } from '../domain/entities/create-quote-price.entitiy';

@Injectable()
export class PrismaQuotePriceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(quotes: CreateQuotePriceEntity[]): Promise<void> {
    await this.prisma.quotePrice.createMany({
      data: quotes.map(
        ({ quoteId, price }): Prisma.QuotePriceCreateManyInput => ({
          quoteId,
          change: price.change,
          currentPrice: price.currentPrice,
          high: price.high,
          low: price.low,
          open: price.open,
          percentChange: price.percentChange,
          previousClose: price.previousClose,
        }),
      ),
    });
  }
}
