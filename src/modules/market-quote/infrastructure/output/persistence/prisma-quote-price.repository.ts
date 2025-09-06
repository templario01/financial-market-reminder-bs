import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/database/prisma.service';
import { ExternalQuotePriceEntity } from '../../../domain/entities/quote-price.entity';

@Injectable()
export class PrismaQuotePriceRepository {
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
}
