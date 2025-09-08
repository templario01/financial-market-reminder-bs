import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TimeSeries } from './dtos/timeseries.request.dto';
import { AlphavantageConfig } from '../../../../../core/settings/settings.model';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import {
  AlphavantageResponseDto,
  DailyResponse,
  MonthlyAdjustedResponse,
  WeeklyAdjustedResponse,
} from './dtos/alphavantage.response.dto';
import { TimeSerieElementQuoteEntityMapper } from './mappers/time-serie-element-quote-entity.mapper';
import { MetadataQuoteEntityMapper } from './mappers/metadata-quote-entity.mapper';
import { plainToInstance } from 'class-transformer';
import { QuoteTimeSerieEntity } from '../../../domain/entities/time-serie-quote.entity';

@Injectable()
export class AlphavantageRepository {
  private readonly logger = new Logger(AlphavantageRepository.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { apiUrl, apiKey } =
      this.configService.get<AlphavantageConfig>('alphavantage')!;
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }
  async getDailyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity> {
    const url = `${this.apiUrl}/query?function=TIME_SERIES_${TimeSeries.DAILY}&symbol=${ticker}&apikey=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(`Error fetching market quote ${error.message}`);
          throw new InternalServerErrorException(
            'Failed to fetch time series data',
          );
        }),
        map(({ data }: AlphavantageResponseDto<DailyResponse>) => {
          return plainToInstance(QuoteTimeSerieEntity, {
            metadata: MetadataQuoteEntityMapper.toEntity(data['Meta Data']),
            elements: TimeSerieElementQuoteEntityMapper.toEntities(
              data['Time Series (Daily)'],
            ),
          } as QuoteTimeSerieEntity);
        }),
      ),
    );
  }

  async getWeeklyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity> {
    const url = `${this.apiUrl}/query?function=TIME_SERIES_${TimeSeries.WEEKLY_ADJUSTED}&symbol=${ticker}&apikey=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(`Error fetching market quote ${error.message}`);
          throw new InternalServerErrorException(
            'Failed to fetch time series data',
          );
        }),
        map(({ data }: AlphavantageResponseDto<WeeklyAdjustedResponse>) => {
          return plainToInstance(QuoteTimeSerieEntity, {
            metadata: MetadataQuoteEntityMapper.toEntity(data['Meta Data']),
            elements: TimeSerieElementQuoteEntityMapper.toEntities(
              data['Weekly Adjusted Time Series'],
            ),
          } as QuoteTimeSerieEntity);
        }),
      ),
    );
  }

  async getMonthlyTimeSeries(ticker: string): Promise<QuoteTimeSerieEntity> {
    const url = `${this.apiUrl}/query?function=TIME_SERIES_${TimeSeries.MONTHLY_ADJUSTED}&symbol=${ticker}&apikey=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(`Error fetching market quote ${error.message}`);
          throw new InternalServerErrorException(
            'Failed to fetch time series data',
          );
        }),
        map(({ data }: AlphavantageResponseDto<MonthlyAdjustedResponse>) => {
          return plainToInstance(QuoteTimeSerieEntity, {
            metadata: MetadataQuoteEntityMapper.toEntity(data['Meta Data']),
            elements: TimeSerieElementQuoteEntityMapper.toEntities(
              data['Monthly Adjusted Time Series'],
            ),
          } as QuoteTimeSerieEntity);
        }),
      ),
    );
  }
}
