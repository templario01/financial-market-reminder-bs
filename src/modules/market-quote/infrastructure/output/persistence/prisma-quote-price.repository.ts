import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../core/database/prisma.service';

@Injectable()
export class PrismaQuotePriceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByQuoteId(quoteId: string) {
    const quotePrice = await this.prisma.quotePrice.findMany({
      where: { quoteId },
    });
    return quotePrice;
  }
}
