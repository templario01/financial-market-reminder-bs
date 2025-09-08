import { plainToInstance } from 'class-transformer';
import { AdjustedTimeSerieElementQuoteEntity } from '../../../../domain/entities/adjusted-time-serie-element-quote.entity';
import {
  DailyTimeSeries,
  AdjustedTimeSeries,
} from '../dtos/alphavantage.response.dto';

export class TimeSerieElementQuoteEntityMapper {
  static toEntities(
    timeSeries: DailyTimeSeries,
  ): AdjustedTimeSerieElementQuoteEntity[];
  static toEntities(
    timeSeries: AdjustedTimeSeries,
  ): AdjustedTimeSerieElementQuoteEntity[];

  static toEntities(
    timeSeries: DailyTimeSeries | AdjustedTimeSeries,
  ): AdjustedTimeSerieElementQuoteEntity[] {
    return Object.entries(timeSeries).map(([date, values]) =>
      plainToInstance(AdjustedTimeSerieElementQuoteEntity, {
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
      } as AdjustedTimeSerieElementQuoteEntity),
    );
  }
}
