import { Controller, Head, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncPricesForAllQuotesUseCase } from '../../application/create-quote-prices.use-case';
import { NotifyQuotationStatsToUsersUseCase } from '../../application/notify-quotation-stats-to-users.use-case';

@Controller('market-reminder')
export class MarketReminderController {
  constructor(
    private readonly syncPricesForAllQuotesUseCase: SyncPricesForAllQuotesUseCase,
    private readonly notifyQuotationStatsToUsersUseCase: NotifyQuotationStatsToUsersUseCase,
  ) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Head('sync-quote-prices')
  syncQuotePrices() {
    this.syncPricesForAllQuotesUseCase.execute();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Head('notify-user-reports')
  notifyUserReports() {
    this.notifyQuotationStatsToUsersUseCase.execute();
  }
}
