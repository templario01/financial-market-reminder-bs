import { Injectable } from '@nestjs/common';
import { QuoteRepository } from '../domain/repositories/quote.repository';
import { FinancialMarketRepository } from '../domain/repositories/financial-market.repository';
import { QuoteEntity } from '../domain/entities/quote.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetQuoteInformationUseCase {
  constructor(
    private readonly financialMarketRepository: FinancialMarketRepository,
    private readonly quoteRepository: QuoteRepository,
  ) {}

  async execute(ticker: string): Promise<QuoteEntity> {
    const tickerUc = ticker.toUpperCase();
    const quotePrice =
      await this.financialMarketRepository.getQuotePrice(tickerUc);
    let quote = await this.quoteRepository.findByTicker(tickerUc);

    if (!quote) {
      quote = await this.registerQuote(tickerUc);
    }

    return plainToInstance(QuoteEntity, { ...quote, price: quotePrice });
  }

  private async registerQuote(ticker: string): Promise<QuoteEntity> {
    const quoteInformation =
      await this.financialMarketRepository.getQuoteInformation(ticker);
    if (!quoteInformation) {
      throw new Error(`No quote information found for ticker: ${ticker}`);
    }
    return this.quoteRepository.create(quoteInformation);
  }
}
