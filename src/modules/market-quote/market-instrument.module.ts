import { Module } from '@nestjs/common';
import { QuoteController } from './infrastructure/input/controllers/quote.controller';
import { HttpModule } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../core/database/prisma.module';
import { GetQuoteInformationUseCase } from './application/get-quote-information.use-case';
import { FinnhubFinancialMarketRepository } from './infrastructure/output/http/finnhub-financial-market.repository';
import { IFinancialMarketRepository } from './domain/repositories/financial-market.repository';
import { PrismaQuoteRepository } from './infrastructure/output/persistence/prisma-quote.repository';
import { IQuoteRepository } from './domain/repositories/quote.repository';
import { GetQuoteImageUseCase } from './application/get-quote-image.use-case';
import { IQuoteImageRepository } from './domain/repositories/quote-image.repository';
import { FinancialModelingRepository } from './infrastructure/output/http/financial-modeling.repository';
import { GetQuotesBySearchUseCase } from './application/get-quotes-by-search.use-case';

export const useCases = [
  GetQuoteInformationUseCase,
  GetQuoteImageUseCase,
  GetQuotesBySearchUseCase,
];
const repositories = [
  {
    provide: IFinancialMarketRepository,
    useClass: FinnhubFinancialMarketRepository,
  },
  {
    provide: IQuoteRepository,
    useClass: PrismaQuoteRepository,
  },
  {
    provide: IQuoteImageRepository,
    useClass: FinancialModelingRepository,
  },
];

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],
  controllers: [QuoteController],
  providers: [...useCases, ...repositories],
})
export class MarketInstrumentModule {}
