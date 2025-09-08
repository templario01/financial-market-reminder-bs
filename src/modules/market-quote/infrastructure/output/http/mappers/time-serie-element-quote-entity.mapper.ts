import { plainToInstance } from 'class-transformer';
import {
  DailyTimeSeries,
  AdjustedTimeSeries,
} from '../dtos/alphavantage.response.dto';
import { TimeSerieElementQuoteEntity } from '../../../../domain/entities/time-serie-element-quote.entity';

export class TimeSerieElementQuoteEntityMapper {
  static toEntities(timeSeries: DailyTimeSeries): TimeSerieElementQuoteEntity[];
  static toEntities(
    timeSeries: AdjustedTimeSeries,
  ): TimeSerieElementQuoteEntity[];

  static toEntities(
    timeSeries: DailyTimeSeries | AdjustedTimeSeries,
  ): TimeSerieElementQuoteEntity[] {
    return Object.entries(timeSeries).map(([date, values]) =>
      plainToInstance(TimeSerieElementQuoteEntity, {
        date,
        open: +values['1. open'],
        high: +values['2. high'],
        low: +values['3. low'],
        close: +values['4. close'],
        ...(values['7. dividend amount']
          ? {
              adjustedClose: +values['5. adjusted close'],
              volume: +values['6. volume'],
              dividendAmount: +values['7. dividend amount'],
            }
          : {
              volume: +values['5. volume'],
            }),
      } as TimeSerieElementQuoteEntity),
    );
  }
}
