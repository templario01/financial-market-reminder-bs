import { Controller, Head, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SyncPricesForAllQuotesUseCase } from '../../application/create-quote-prices.use-case';
import { NotifyQuotationStatsToUsersUseCase } from '../../application/notify-quotation-stats-to-users.use-case';

@Controller('market-reminder')
export class MarketReminderController {
  private readonly logger = new Logger(MarketReminderController.name);
  constructor(
    private readonly syncPricesForAllQuotesUseCase: SyncPricesForAllQuotesUseCase,
    private readonly notifyQuotationStatsToUsersUseCase: NotifyQuotationStatsToUsersUseCase,
  ) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Head('sync-quote-prices')
  syncQuotePrices() {
    this.logger.log('Starting quote prices synchronization...');
    this.syncPricesForAllQuotesUseCase.execute();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Head('notify-user-reports')
  notifyUserReports() {
    this.logger.log('Starting user reports notification...');
    this.notifyQuotationStatsToUsersUseCase.execute();
  }
}
