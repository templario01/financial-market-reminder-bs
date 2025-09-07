import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { IAccountFavoriteQuoteRepository } from '../../domain/repositories/user-favorite-quote.repository';
import { QuoteEntity } from '../../../market-quote/domain/entities/quote.entity';

@Injectable()
export class PrismaAccountFavoriteQuoteRepository
  implements IAccountFavoriteQuoteRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(accountId: string, quoteId: string): Promise<void> {
    await this.prismaService.userFavoriteQuote.create({
      data: {
        account: {
          connect: { id: accountId },
        },
        quote: {
          connect: { id: quoteId },
        },
      },
    });
  }

  async remove(accountId: string, quoteId: string): Promise<void> {
    await this.prismaService.userFavoriteQuote.deleteMany({
      where: {
        account: {
          id: accountId,
        },
        quote: {
          id: quoteId,
        },
      },
    });
  }

  async findFavoriteQuotesByAccountId(
    accountId: string,
  ): Promise<QuoteEntity[]> {
    const favoriteQuotes = await this.prismaService.userFavoriteQuote.findMany({
      where: {
        account: {
          id: accountId,
        },
      },
      select: {
        quote: true,
      },
    });
    return favoriteQuotes.map((fav) => fav.quote);
  }
}
