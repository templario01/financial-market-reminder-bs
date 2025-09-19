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
import { NotifyQuotationStatsToUsersUseCase } from './application/notify-quotation-stats-to-users.use-case';
import { IFinancialMarketHistoricRepository } from '../market-quote/domain/repositories/financial-market-historic.repository';
import { AlphavantageRepository } from '../market-quote/infrastructure/output/http/alphavantage.repository';
import { IAccountRepository } from '../account-management/domain/repositories/account.repository';
import { PrismaAccountRepository } from '../account-management/infrastructure/output/prisma-account.repository';
import { NotifyUserReportCommand } from '../../core/commands/execute-user-notification.command';
import { MailModule } from '../../core/common/modules/mail/mail.module';

const useCases = [
  SyncPricesForAllQuotesUseCase,
  NotifyQuotationStatsToUsersUseCase,
];

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
  {
    provide: IFinancialMarketHistoricRepository,
    useClass: AlphavantageRepository,
  },
  {
    provide: IAccountRepository,
    useClass: PrismaAccountRepository,
  },
];

@Module({
  imports: [PrismaModule, HttpModule, ConfigModule, MailModule],
  providers: [...useCases, ...repositories, NotifyUserReportCommand],
})
export class MarketReminderModule {}
