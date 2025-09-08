import { Injectable } from '@nestjs/common';
import { QuoteTimeSerieEntity } from '../entities/time-serie-quote.entity';

@Injectable()
export abstract class IFinancialMarketHistoricRepository {
  abstract getDailyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity>;
  abstract getWeeklyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity>;
  abstract getMonthlyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity>;
}
