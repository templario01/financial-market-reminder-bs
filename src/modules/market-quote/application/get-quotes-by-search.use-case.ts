import { Injectable } from '@nestjs/common';
import { IQuoteRepository } from '../domain/repositories/quote.repository';
import { QuoteEntity } from '../domain/entities/quote.entity';

@Injectable()
export class GetQuotesBySearchUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(word: string): Promise<QuoteEntity[]> {
    return this.quoteRepository.findManyByTickerLetters(word);
  }
}
