import { Injectable, Logger } from '@nestjs/common';
import { AccountEntity } from '../../account-management/domain/entities/account.entity';
import { MarketReportEntity } from '../domain/entities/market-report.entity';
import { IMailerRepository } from '../../../core/common/modules/mail/domain/repositories/email-repository';
import { plainToInstance } from 'class-transformer';
import { SendEmailNotificationEntity } from '../../../core/common/modules/mail/domain/entities/send-email-notification.entity';

@Injectable()
export class SendMonthlyReportToUserUseCase {
  private readonly logger = new Logger(SendMonthlyReportToUserUseCase.name);
  constructor(private readonly mailerRepository: IMailerRepository) {}

  async execute(
    account: AccountEntity,
    accountQuotes: string[],
    monthlyMarketReport: MarketReportEntity,
  ): Promise<void> {
    const accountMonthlyReportQuotes = monthlyMarketReport.quotes.filter(
      (quote) => accountQuotes?.includes(quote.ticker),
    );

    this.logger.log(
      `Enviando reporte mensual a ${account.user?.email} con ${accountMonthlyReportQuotes.length} cotizaciones.`,
    );

    await this.mailerRepository.sendEmailNotification(
      plainToInstance(SendEmailNotificationEntity, {
        email: account.user?.email as string,
        fromName: 'Stock Reminder',
        subject: 'Reporte Mensual del Mercado',
        templateId: 'monthlyReportEmail',
        body: {
          ...monthlyMarketReport,
          quotes: accountMonthlyReportQuotes,
        },
      } as SendEmailNotificationEntity),
    );
  }
}
