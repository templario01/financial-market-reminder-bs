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
} from '../domain/entities/market-report.entity';
import { IFinancialMarketHistoricRepository } from '../../market-quote/domain/repositories/financial-market-historic.repository';
import { SendWeeklyReportToUserUseCase } from './send-weekly-report-to-user.use-case';
import { IQuotePriceRepository } from '../../market-quote/domain/repositories/quote-price.respository';
import { TimeSerieElementQuoteEntity } from '../../market-quote/domain/entities/time-serie-element-quote.entity';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: 'notify-quotation-stats-to-users',
    timeZone: 'America/New_York',
  })
  async execute(): Promise<void> {
    try {
      const accounts = await this.accountRepository.getAccountsWithRelations();
      const quotes = await this.quoteRepository.findAll();
      const weeklyTimeserie = await this.financialMarketHistoricRepository
        .getWeeklyTimeSeries(quotes[0].ticker)
        .catch((error) => {
          if (!(error instanceof InternalServerErrorException)) {
            this.logger.error({
              msg: `Error parsing weekly time series: ${error.message}`,
              err: error,
            });
          }
          return null;
        });
      const [currentWeekDay, lastWeekDay] = weeklyTimeserie?.elements || [];

      const weeklyMarketReport = await this.getWeeklyReportQuotesFromDatasource(
        lastWeekDay.date,
        currentWeekDay.date,
        quotes,
      );

      for (const account of accounts) {
        const accountFavoriteQuoteTickers = quotes
          .filter((quote) => account.favoriteQuotes?.includes(quote.id))
          .map((quote) => quote.ticker);

        await this.sendWeeklyReportToUserUseCase.execute(
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

  private async getWeeklyReportQuotesFromDatasource(
    startDate: string,
    endDate: string,
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
          linealChartUrl: this.generateQuickChartUrl(timeSeries),
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
  private generateQuickChartUrl(
    dates: TimeSerieElementQuoteEntity[] | GenericTimeSerie[],
  ): string {
    const sortedTimeSeries = [...dates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const labels = sortedTimeSeries.map((timeSerie) => {
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
