import { Injectable, NotFoundException } from '@nestjs/common';
import { IAccountFavoriteQuoteRepository } from '../domain/repositories/user-favorite-quote.repository';
import { IQuoteRepository } from '../../market-quote/domain/repositories/quote.repository';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';

@Injectable()
export class RemoveQuoteFromFavoriteUseCase {
  constructor(
    private readonly userFavoriteQuoteRepository: IAccountFavoriteQuoteRepository,
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  async execute(accountId: string, quoteId: string): Promise<QuoteEntity> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new NotFoundException(`Quote not found`);
    }

    await this.userFavoriteQuoteRepository.remove(accountId, quoteId);

    return quote;
  }
}
