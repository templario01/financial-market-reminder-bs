import { Module } from '@nestjs/common';
import { GetEtfInformationUseCase } from './application/get-etf-price.use-case';
import { QuoteController } from './infrastructure/input/controllers/quote.controller';
import { HttpModule } from '@nestjs/axios';
import { MarketQuoteRepository } from './domain/repositories/market-quote.repository';
import { FinnhubMarketRepository } from './infrastructure/output/http/finnhub-market.repository';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../core/database/prisma.module';

export const useCases = [GetEtfInformationUseCase];
const repositories = [
  {
    provide: MarketQuoteRepository,
    useClass: FinnhubMarketRepository,
  },
];

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],
  controllers: [QuoteController],
  providers: [...useCases, ...repositories],
})
export class MarketInstrumentModule {}
