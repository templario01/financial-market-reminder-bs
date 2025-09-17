import { Command, CommandRunner } from 'nest-commander';

import { NotifyQuotationStatsToUsersUseCase } from '../../modules/market-reminder/application/notify-quotation-stats-to-users.use-case';

@Command({
  name: 'notify-user-report',
  description: 'Notifica y genera el reporte de usuario',
})
export class NotifyUserReportCommand extends CommandRunner {
  constructor(
    private readonly notifyQuotationStatsToUsersUseCase: NotifyQuotationStatsToUsersUseCase,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.notifyQuotationStatsToUsersUseCase.execute();
  }
}
