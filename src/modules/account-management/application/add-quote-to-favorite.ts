import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserFavoriteQuoteRepository } from '../domain/repositories/user-favorite-quote.repository';
import { IQuoteRepository } from '../../market-quote/domain/repositories/quote.repository';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';

@Injectable()
export class AddQuoteToFavorite {
  constructor(
    private readonly userFavoriteQuoteRepository: IUserFavoriteQuoteRepository,
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  async execute(userId: string, quoteId: string): Promise<QuoteEntity> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${quoteId} not found`);
    }

    await this.userFavoriteQuoteRepository.save(userId, quoteId);

    return quote;
  }
}
