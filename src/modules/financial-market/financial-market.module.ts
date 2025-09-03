import { Module } from '@nestjs/common';
import { GetEtfInformationUseCase } from './application/get-etf-price.use-case';
import { FinancialMarketController } from './infrastructure/input/controllers/financial-market.controller';
import { HttpModule } from '@nestjs/axios';
import { MarketQuoteRepository } from './domain/repositories/market-quote.repository';
import { FinnhubMarketRepository } from './infrastructure/output/http/finnhub-market.repository';
import { ConfigModule } from '@nestjs/config';

export const useCases = [GetEtfInformationUseCase];
const repositories = [
  {
    provide: MarketQuoteRepository,
    useClass: FinnhubMarketRepository,
  },
];

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FinancialMarketController],
  providers: [...useCases, ...repositories],
})
export class FinancialMarketModule {}
