import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IFinancialMarketHistoricRepository } from '../../market-quote/domain/repositories/financial-market-historic.repository';
import { IAccountRepository } from '../../account-management/domain/repositories/account.repository';
import { IQuoteRepository } from '../../market-quote/domain/repositories/quote.repository';
import { TimeSerieElementQuoteEntity } from '../../market-quote/domain/entities/time-serie-element-quote.entity';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';
import {
  ScheduleExecuteDay,
  SchedulePeriod,
} from '../../../core/common/enums/account.enum';
import { IMailerRepository } from '../../../core/common/modules/mail/domain/repositories/email-repository';
import { AccountEntity } from '../../account-management/domain/entities/account.entity';

export type MarketReportQuote = {
  ticker: string;
  currentPrice: number;
  lastWeekPrice: number;
  change: number;
  percentChange: number;
  linealChartUrl: string;
};

export type MarketReport = {
  title: string;
  description: string;
  quotes: MarketReportQuote[];
};

export type WeeklyExecutionDay =
  | ScheduleExecuteDay.EVERY_MONDAY
  | ScheduleExecuteDay.EVERY_TUESDAY
  | ScheduleExecuteDay.EVERY_WEDNESDAY
  | ScheduleExecuteDay.EVERY_THURSDAY
  | ScheduleExecuteDay.EVERY_FRIDAY
  | ScheduleExecuteDay.EVERY_SATURDAY
  | ScheduleExecuteDay.EVERY_SUNDAY;

@Injectable()
export class NotifyQuotationStatsToUsersUseCase {
  private readonly logger = new Logger(NotifyQuotationStatsToUsersUseCase.name);
  constructor(
    private readonly financialMarketHistoricRepository: IFinancialMarketHistoricRepository,
    private readonly quoteRepository: IQuoteRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly mailerRepository: IMailerRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: 'notify-quotation-stats-to-users',
    timeZone: 'America/New_York',
  })
  async execute(): Promise<void> {
    try {
      const accounts =
        await this.accountRepository.getAccountsWithNotificationSchedules();
      const quotes = await this.quoteRepository.findAll();
      const weeklyMarketReport = await this.getWeeklyReportQuotes(quotes);

      for (const account of accounts) {
        const accountFavoriteQuoteTickers = quotes
          .filter((quote) => account.favoriteQuotes?.includes(quote.id))
          .map((quote) => quote.ticker);
        await this.handleWeeklyReport(
          account,
          accountFavoriteQuoteTickers,
          weeklyMarketReport,
        );
      }

      this.logger.log('Notificaciones enviadas');
    } catch (error) {
      this.logger.error({
        msg: `Error al enviar notificaciones: ${error.message}`,
        err: error,
      });
    }
  }

  private async handleWeeklyReport(
    account: AccountEntity,
    accountQuotes: string[],
    weeklyMarketReport: MarketReport,
  ): Promise<void> {
    const weeklyNotificationSchedule = account.notificationSchedules?.find(
      (schedule) => schedule.period === SchedulePeriod.WEEKLY,
    );
    if (!weeklyNotificationSchedule) return;
    const isCurrentWeekDayEqualsToExecutionDay =
      this.compareWeekDayEqualsToExecutionDay(
        weeklyNotificationSchedule.executionDay as WeeklyExecutionDay,
      );
    if (!isCurrentWeekDayEqualsToExecutionDay) return;
    const accountWeeklyReportQuotes = weeklyMarketReport.quotes.filter(
      (quote) => accountQuotes?.includes(quote.ticker),
    );

    await this.mailerRepository.sendEmailNotification({
      email: account.user?.email as string,
      subject: 'Reporte Semanal del Mercado',
      templateId: 'weeklyReportEmail',
      body: {
        ...weeklyMarketReport,
        quotes: accountWeeklyReportQuotes,
      },
    });
  }

  private compareWeekDayEqualsToExecutionDay(
    executionDay?: WeeklyExecutionDay,
  ): boolean {
    if (!executionDay) return false;
    const dayMap: Record<WeeklyExecutionDay, number> = {
      [ScheduleExecuteDay.EVERY_MONDAY]: 1,
      [ScheduleExecuteDay.EVERY_TUESDAY]: 2,
      [ScheduleExecuteDay.EVERY_WEDNESDAY]: 3,
      [ScheduleExecuteDay.EVERY_THURSDAY]: 4,
      [ScheduleExecuteDay.EVERY_FRIDAY]: 5,
      [ScheduleExecuteDay.EVERY_SATURDAY]: 6,
      [ScheduleExecuteDay.EVERY_SUNDAY]: 0,
    };
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    return currentDayOfWeek === dayMap[executionDay];
  }

  async getWeeklyReportQuotes(quotes: QuoteEntity[]): Promise<MarketReport> {
    const marketReportQuotes: MarketReportQuote[] = [];
    for (const quote of quotes) {
      const [weeklyTimeserie, dailyTimeserie] = await Promise.all([
        this.financialMarketHistoricRepository
          .getWeeklyTimeSeries(quote.ticker)
          .catch((error) => {
            if (!(error instanceof InternalServerErrorException)) {
              this.logger.error({
                msg: `Error parsing weekly time series: ${error.message}`,
                err: error,
              });
            }
            return null;
          }),
        this.financialMarketHistoricRepository
          .getMonthlyTimeSeries(quote.ticker)
          .catch((error) => {
            this.logger.error({
              msg: `Error parsing monthly time series: ${error.message}`,
              err: error,
            });
            return null;
          }),
        this.financialMarketHistoricRepository
          .getDailyTimeSeries(quote.ticker)
          .catch((error) => {
            this.logger.error({
              msg: `Error parsing daily time series: ${error.message}`,
              err: error,
            });
            return null;
          }),
      ]);

      const [currentWeekDay, lastWeekDay] = weeklyTimeserie?.elements || [];
      const days = dailyTimeserie?.elements || [];

      const weekDays = this.filterElementsBetweenDates(
        currentWeekDay?.date,
        lastWeekDay?.date,
        days,
      );

      const weeklyReport: MarketReportQuote = {
        ticker: quote.ticker,
        currentPrice: currentWeekDay?.close || 0,
        lastWeekPrice: lastWeekDay?.close || 0,
        change: (currentWeekDay?.close || 0) - (lastWeekDay?.close || 0),
        percentChange:
          (((currentWeekDay?.close || 0) - (lastWeekDay?.close || 0)) /
            (lastWeekDay?.close || 1)) *
          100,
        linealChartUrl: this.generateQuickChartUrl(weekDays),
      };

      marketReportQuotes.push(weeklyReport);
    }
    return {
      title: 'Reporte Semanal del Mercado',
      description:
        'Resumen semanal de las cotizaciones monitoreadas en tu cuenta.',
      quotes: marketReportQuotes,
    };
  }

  private filterElementsBetweenDates(
    currentWeekDay: string,
    lastWeekDay: string,
    elements: TimeSerieElementQuoteEntity[],
  ): TimeSerieElementQuoteEntity[] {
    const start = new Date(currentWeekDay).getTime();
    const end = new Date(lastWeekDay).getTime();
    return elements.filter((el) => {
      const elDate = new Date(el.date).getTime();
      return elDate >= end && elDate <= start;
    });
  }
  private generateQuickChartUrl(dates: TimeSerieElementQuoteEntity[]): string {
    const sorted = [...dates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const labels = sorted.map((d) => {
      return format(parseISO(d.date), 'EEEE dd', { locale: es }).toUpperCase();
    });
    const data = sorted.map((d) => d.close);
    const min = Math.min(...data);
    const max = Math.max(...data);

    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Precio de Cierre',
            data,
            fill: false,
            borderColor: 'blue',
            pointBackgroundColor: 'blue',
            pointRadius: 5,
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Precio de Cierre (Semana)',
          },
          datalabels: {
            align: 'top',
            color: 'black',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value.toFixed(2),
          },
        },
        scales: {
          y: {
            suggestedMin: min - 5,
            suggestedMax: max + 5,
          },
        },
      },
      plugins: ['chartjs-plugin-datalabels'],
    };

    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    return `https://quickchart.io/chart?c=${encodedConfig}`;
  }
}
