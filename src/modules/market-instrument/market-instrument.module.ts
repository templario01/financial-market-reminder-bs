import { Module } from '@nestjs/common';
import { QuoteController } from './infrastructure/input/controllers/quote.controller';
import { HttpModule } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../core/database/prisma.module';
import { GetQuoteInformationUseCase } from './application/get-quote-information.use-case';
import { FinnhubFinancialMarketRepository } from './infrastructure/output/http/finnhub-financial-market.repository';
import { FinancialMarketRepository } from './domain/repositories/financial-market.repository';
import { PrismaQuoteRepository } from './infrastructure/output/persistence/prisma-quote.repository';
import { QuoteRepository } from './domain/repositories/quote.repository';

export const useCases = [GetQuoteInformationUseCase];
const repositories = [
  {
    provide: FinancialMarketRepository,
    useClass: FinnhubFinancialMarketRepository,
  },
  {
    provide: QuoteRepository,
    useClass: PrismaQuoteRepository,
  },
];

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],
  controllers: [QuoteController],
  providers: [...useCases, ...repositories],
})
export class MarketInstrumentModule {}
