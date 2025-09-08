import { Module } from '@nestjs/common';
import { SyncPricesForAllQuotesUseCase } from './application/create-quote-prices.use-case';
import { IQuotePriceRepository } from '../market-quote/domain/repositories/quote-price.respository';
import { PrismaQuotePriceRepository } from '../market-quote/infrastructure/output/persistence/prisma-quote-price.repository';
import { IFinancialMarketRepository } from '../market-quote/domain/repositories/financial-market.repository';
import { FinnhubFinancialMarketRepository } from '../market-quote/infrastructure/output/http/finnhub-financial-market.repository';
import { IQuoteRepository } from '../market-quote/domain/repositories/quote.repository';
import { PrismaQuoteRepository } from '../market-quote/infrastructure/output/persistence/prisma-quote.repository';
import { PrismaModule } from '../../core/database/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

const useCases = [SyncPricesForAllQuotesUseCase];

const repositories = [
  {
    provide: IQuoteRepository,
    useClass: PrismaQuoteRepository,
  },
  {
    provide: IQuotePriceRepository,
    useClass: PrismaQuotePriceRepository,
  },
  {
    provide: IFinancialMarketRepository,
    useClass: FinnhubFinancialMarketRepository,
  },
];

@Module({
  imports: [PrismaModule, HttpModule, ConfigModule],
  providers: [...useCases, ...repositories],
})
export class MarketReminderModule {}
