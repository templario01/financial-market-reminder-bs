import { Injectable, Logger } from '@nestjs/common';
import { IFinancialMarketRepository } from '../../market-quote/domain/repositories/financial-market.repository';
import { CreateQuotePriceEntity } from '../domain/entities/create-quote-price.entitiy';
import { Cron } from '@nestjs/schedule';
import { IQuotePriceRepository } from '../../market-quote/domain/repositories/quote-price.respository';
import { IQuoteRepository } from '../../market-quote/domain/repositories/quote.repository';

@Injectable()
export class SyncPricesForAllQuotesUseCase {
  private readonly logger = new Logger(SyncPricesForAllQuotesUseCase.name);
  constructor(
    private readonly financialMarketRepository: IFinancialMarketRepository,
    private readonly quotePriceRepository: IQuotePriceRepository,
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  @Cron('0 16 * * 1-5')
  async execute(): Promise<void> {
    const quotes = await this.quoteRepository.findAll();
    this.logger.log(`Found ${quotes.length} quotes to update prices.`);
    const createQuotePriceEntities = await Promise.all(
      quotes.map(async (quote) => {
        const price = await this.financialMarketRepository.getQuotePrice(
          quote.ticker,
        );
        return new CreateQuotePriceEntity(quote.id, price);
      }),
    );

    await this.quotePriceRepository.createMany(createQuotePriceEntities);
    this.logger.log('Quote prices updated successfully.');
  }
}
