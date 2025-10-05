import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/database/prisma.service';
import {
  ExternalQuotePriceEntity,
  QuotePriceEntity,
} from '../../../domain/entities/quote-price.entity';
import { CreateQuotePriceEntity } from '../../../../market-reminder/domain/entities/create-quote-price.entitiy';
import { Prisma } from '@prisma/client';
import { IQuotePriceRepository } from '../../../domain/repositories/quote-price.respository';
import { plainToInstance } from 'class-transformer';
import { deleteDuplicatedDays } from '../../../../../core/common/utils/dates';

@Injectable()
export class PrismaQuotePriceRepository implements IQuotePriceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByQuoteId(quoteId: string) {
    const quotePrice = await this.prisma.quotePrice.findMany({
      where: { quoteId },
    });
    return quotePrice;
  }

  async create(data: ExternalQuotePriceEntity, quoteId: string) {
    const quotePrice = await this.prisma.quotePrice.create({
      data: {
        ...data,
        quoteId,
      },
    });
    return quotePrice;
  }

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

  async findAllByQuoteIdBetweenDates(
    quoteId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<QuotePriceEntity[]> {
    const quotePrices = await this.prisma.quotePrice.findMany({
      where: {
        quoteId,
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: 'desc' },
    });
    return quotePrices
      .map((quotePrice) =>
        plainToInstance(QuotePriceEntity, {
          ...quotePrice,
          lastUpdated: quotePrice.createdAt,
        } as QuotePriceEntity),
      )
      .filter(deleteDuplicatedDays((price) => price.lastUpdated));
  }
}
