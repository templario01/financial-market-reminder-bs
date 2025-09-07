import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { IUserFavoriteQuoteRepository } from '../../domain/repositories/user-favorite-quote.repository';

@Injectable()
export class PrismaUserFavoriteQuoteRepository
  implements IUserFavoriteQuoteRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(userId: string, quoteId: string): Promise<void> {
    await this.prismaService.userFavoriteQuote.create({
      data: {
        user: {
          connect: { id: userId },
        },
        quote: {
          connect: { id: quoteId },
        },
      },
    });
  }

  async remove(userId: string, quoteId: string): Promise<void> {
    await this.prismaService.userFavoriteQuote.deleteMany({
      where: {
        user: {
          id: userId,
        },
        quote: {
          id: quoteId,
        },
      },
    });
  }
}
