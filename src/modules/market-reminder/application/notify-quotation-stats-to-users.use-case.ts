import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IAccountRepository } from '../../account-management/domain/repositories/account.repository';
import { IQuoteRepository } from '../../market-quote/domain/repositories/quote.repository';
import { QuoteEntity } from '../../market-quote/domain/entities/quote.entity';
import { roundTo } from '../../../core/common/utils/math-operations';
import {
  MarketReportEntity,
  MarketReportQuote,
  MarketReportQuoteMonthly,
} from '../domain/entities/market-report.entity';
import { IFinancialMarketHistoricRepository } from '../../market-quote/domain/repositories/financial-market-historic.repository';
import { SendWeeklyReportToUserUseCase } from './send-weekly-report-to-user.use-case';
import { IQuotePriceRepository } from '../../market-quote/domain/repositories/quote-price.respository';
import { TimeSerieElementQuoteEntity } from '../../market-quote/domain/entities/time-serie-element-quote.entity';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  getLastMonthPeriodByDate,
  getWeeklyDatesLimitsByDate,
} from '../../../core/common/utils/dates';
import { SendMonthlyReportToUserUseCase } from './send-monthly-report-to-user.use-case';
import { SchedulePeriod } from '../../../core/common/enums/account.enum';

export type GenericTimeSerie = {
  date: string;
  close: number;
};

@Injectable()
export class NotifyQuotationStatsToUsersUseCase {
  private readonly logger = new Logger(NotifyQuotationStatsToUsersUseCase.name);
  constructor(
    private readonly quoteRepository: IQuoteRepository,
    private readonly quotePriceRepository: IQuotePriceRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly financialMarketHistoricRepository: IFinancialMarketHistoricRepository,
    private readonly sendWeeklyReportToUserUseCase: SendWeeklyReportToUserUseCase,
    private readonly sendMonthlyReportToUserUseCase: SendMonthlyReportToUserUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: 'notify-quotation-stats-to-users',
    timeZone: 'America/New_York',
  })
  async execute(): Promise<void> {
    try {
      const accounts = await this.accountRepository.getAccountsWithRelations();
      const quotes = await this.quoteRepository.findAll();
      const weeklyMarketReport = await this.getReportFromWeeklyInterval(quotes);
      const monthlyMarketReport =
        await this.getReportFromMonthlyInterval(quotes);

      for (const account of accounts) {
        const accountFavoriteQuoteTickers = quotes
          .filter((quote) => account.favoriteQuotes?.includes(quote.id))
          .map((quote) => quote.ticker);

        await this.sendWeeklyReportToUserUseCase.execute(
          account,
          accountFavoriteQuoteTickers,
          weeklyMarketReport,
        );

        if (new Date().getDate() === 1) {
          await this.sendMonthlyReportToUserUseCase.execute(
            account,
            accountFavoriteQuoteTickers,
            monthlyMarketReport,
          );
        }
      }

      this.logger.log('Notificaciones enviadas');
    } catch (error) {
      this.logger.error({
        msg: `Error al enviar notificaciones: ${error.message}`,
        err: error,
      });
    }
  }

  private async getReportFromWeeklyInterval(
    quotes: QuoteEntity[],
  ): Promise<MarketReportEntity> {
    const { startDate, endDate } = getWeeklyDatesLimitsByDate(new Date());

    return await this.getWeeklyReportQuotesFromDatasource(
      startDate,
      endDate,
      quotes,
    );
  }

  private async getReportFromMonthlyInterval(
    quotes: QuoteEntity[],
  ): Promise<MarketReportEntity> {
    const { startDate, endDate } = getLastMonthPeriodByDate(new Date());

    return await this.getMonthlyReportQuotesFromDatasource(
      startDate,
      endDate,
      quotes,
    );
  }

  private async getWeeklyReportQuotesFromDatasource(
    startDate: Date,
    endDate: Date,
    quotes: QuoteEntity[],
  ): Promise<MarketReportEntity> {
    const marketReportQuotes: MarketReportQuote[] = [];
    for (const quote of quotes) {
      const prices =
        await this.quotePriceRepository.findAllByQuoteIdBetweenDates(
          quote.id,
          startDate,
          endDate,
        );
      const currentWeekPrice = prices[0];
      const lastWeekPrice = prices[prices.length - 1];
      if (currentWeekPrice !== undefined && lastWeekPrice !== undefined) {
        const timeSeries: GenericTimeSerie[] = [];
        for (const price of prices) {
          timeSeries.push({
            date: format(price.lastUpdated, 'yyyy-MM-dd'),
            close: price.currentPrice,
          });
        }

        const weeklyReport: MarketReportQuote = {
          ticker: quote.ticker,
          currentPrice: currentWeekPrice.currentPrice || 0,
          lastWeekPrice: lastWeekPrice.currentPrice || 0,
          change: roundTo(
            (currentWeekPrice?.currentPrice || 0) -
              (lastWeekPrice?.currentPrice || 0),
          ),
          percentChange: roundTo(
            (((currentWeekPrice?.currentPrice || 0) -
              (lastWeekPrice?.currentPrice || 0)) /
              (lastWeekPrice?.currentPrice || 1)) *
              100,
          ),
          linealChartUrl: this.generateQuickChartUrl(
            timeSeries,
            SchedulePeriod.WEEKLY,
          ),
        };
        marketReportQuotes.push(weeklyReport);
      }
    }
    return {
      title: 'Reporte Semanal del Mercado',
      description:
        'Resumen semanal de las cotizaciones monitoreadas en tu cuenta.',
      quotes: marketReportQuotes,
    };
  }

  private async getMonthlyReportQuotesFromDatasource(
    startDate: Date,
    endDate: Date,
    quotes: QuoteEntity[],
  ): Promise<MarketReportEntity> {
    const marketReportQuotes: MarketReportQuoteMonthly[] = [];
    for (const quote of quotes) {
      const prices =
        await this.quotePriceRepository.findAllByQuoteIdBetweenDates(
          quote.id,
          startDate,
          endDate,
        );
      const currentMonthPrice = prices[0];
      const lastMonthPrice = prices[prices.length - 1];
      if (currentMonthPrice !== undefined && lastMonthPrice !== undefined) {
        const timeSeries: GenericTimeSerie[] = [];
        for (const price of prices) {
          timeSeries.push({
            date: format(price.lastUpdated, 'yyyy-MM-dd'),
            close: price.currentPrice,
          });
        }

        const monthlyReport: MarketReportQuoteMonthly = {
          ticker: quote.ticker,
          currentPrice: currentMonthPrice.currentPrice || 0,
          lastMonthPrice: lastMonthPrice.currentPrice || 0,
          change: roundTo(
            (currentMonthPrice?.currentPrice || 0) -
              (lastMonthPrice?.currentPrice || 0),
          ),
          percentChange: roundTo(
            (((currentMonthPrice?.currentPrice || 0) -
              (lastMonthPrice?.currentPrice || 0)) /
              (lastMonthPrice?.currentPrice || 1)) *
              100,
          ),
          linealChartUrl: this.generateQuickChartUrl(
            timeSeries,
            SchedulePeriod.MONTHLY,
          ),
        };
        marketReportQuotes.push(monthlyReport);
      }
    }
    return {
      title: 'Reporte Mensual del Mercado',
      description:
        'Resumen mensual de las cotizaciones monitoreadas en tu cuenta.',
      quotes: marketReportQuotes,
    };
  }

  private generateQuickChartUrl(
    dates: TimeSerieElementQuoteEntity[] | GenericTimeSerie[],
    period: SchedulePeriod,
  ): string {
    const sortedTimeSeries = [...dates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const labels = sortedTimeSeries.map((timeSerie) => {
      if (sortedTimeSeries.length > 5) {
        return format(parseISO(timeSerie.date), 'EEE dd', { locale: es });
      }
      return format(parseISO(timeSerie.date), 'EEEE dd', {
        locale: es,
      }).toUpperCase();
    });
    const data = sortedTimeSeries.map((timeSerie) => timeSerie.close);
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
            text: `Precio de Cierre (${period === SchedulePeriod.MONTHLY ? 'Mensual' : 'Semanal'})`,
          },
          datalabels: {
            align: 'top',
            color: 'black',
            font: {
              weight: 'bold',
              size: 10,
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

  /**
   * @deprecated Use {@link getWeeklyReportQuotesFromDatasource} instead.
   *
   * Retrieves weekly market report quotes from the external APIs for the specified date range and quotes.
   * @param quotes - An array of {@link QuoteEntity} representing the quotes to include in the report.
   * @returns A promise that resolves to a {@link MarketReportEntity} containing the weekly market report data.
   */
  private async getWeeklyReportQuotes(
    quotes: QuoteEntity[],
  ): Promise<MarketReportEntity> {
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
        change: roundTo(
          (currentWeekDay?.close || 0) - (lastWeekDay?.close || 0),
        ),
        percentChange: roundTo(
          (((currentWeekDay?.close || 0) - (lastWeekDay?.close || 0)) /
            (lastWeekDay?.close || 1)) *
            100,
        ),
        linealChartUrl: this.generateQuickChartUrl(
          weekDays,
          SchedulePeriod.WEEKLY,
        ),
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
}
