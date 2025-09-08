import { Injectable } from '@nestjs/common';
import { IQuoteRepository } from '../domain/repositories/quote.repository';
import { IFinancialMarketRepository } from '../domain/repositories/financial-market.repository';
import { QuoteEntity } from '../domain/entities/quote.entity';
import { plainToInstance } from 'class-transformer';
import { GetQuoteImageUseCase } from './get-quote-image.use-case';
import { IFinancialMarketHistoricRepository } from '../domain/repositories/financial-market-historic.repository';

@Injectable()
export class GetQuoteInformationV2UseCase {
  constructor(
    private readonly financialMarketRepository: IFinancialMarketRepository,
    private readonly getQuoteImageUseCase: GetQuoteImageUseCase,
    private readonly quoteRepository: IQuoteRepository,
    private readonly financialMarketHistoricRepository: IFinancialMarketHistoricRepository,
  ) {}

  async execute(ticker: string): Promise<QuoteEntity> {
    const tickerUc = ticker.toUpperCase();
    const quotePrice =
      await this.financialMarketRepository.getQuotePrice(tickerUc);
    let quote = await this.quoteRepository.findByTicker(tickerUc);

    if (!quote) {
      quote = await this.registerQuote(tickerUc);
    }

    const [weeklyTimeserie, monthlyTimeserie, dailyTimeserie, recommendations] =
      await Promise.all([
        this.financialMarketHistoricRepository.getWeeklyTimeSeries(tickerUc),
        this.financialMarketHistoricRepository.getMonthlyTimeSeries(tickerUc),
        this.financialMarketHistoricRepository.getDailyTimeSeries(tickerUc),
        this.financialMarketRepository.getRecommendation(tickerUc),
      ]);

    return plainToInstance(QuoteEntity, {
      ...quote,
      price: quotePrice,
      weeklyTimeserie,
      monthlyTimeserie,
      dailyTimeserie,
      recommendations,
    } as QuoteEntity);
  }

  private async registerQuote(ticker: string): Promise<QuoteEntity> {
    const quoteInformation =
      await this.financialMarketRepository.getQuoteInformation(ticker);
    if (!quoteInformation) {
      throw new Error(`No quote information found for ticker: ${ticker}`);
    }

    const imageUrl = await this.getQuoteImageUseCase.execute(ticker);

    return this.quoteRepository.create({
      ...quoteInformation,
      imageUrl,
    });
  }
}
