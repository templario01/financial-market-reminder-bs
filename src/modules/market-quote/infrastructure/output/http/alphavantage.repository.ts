import { HttpService } from '@nestjs/axios';
import {
  Inject,
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
import { IFinancialMarketHistoricRepository } from '../../../domain/repositories/financial-market-historic.repository';
import { Cache } from '@nestjs/cache-manager';
import { CacheTime } from '../../../../../core/common/enums/cache-ttl';

export function Cacheable(time: CacheTime): MethodDecorator {
  const injectCacheManager = Inject('CACHE_MANAGER');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    injectCacheManager(target, 'cacheManager');

    descriptor.value = async function (...args: any[]) {
      const cacheManager: Cache = this.cacheManager;
      const cacheKey = `${propertyKey}:${args.join(':')}`;
      const cached = await cacheManager.get<QuoteTimeSerieEntity>(cacheKey);
      const logger = new Logger('CacheableDecorator');
      if (cached) {
        logger.log(`Cache hit for key: ${cacheKey}`);
        return cached;
      }
      logger.log(`Cache miss for key: ${cacheKey}`);
      const result = await originalMethod.apply(this, args);
      await cacheManager.set(cacheKey, result, time);
      return result;
    };
    return descriptor;
  };
}

@Injectable()
export class AlphavantageRepository
  implements IFinancialMarketHistoricRepository
{
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
  @Cacheable(CacheTime.ONE_DAY)
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

  @Cacheable(CacheTime.ONE_DAY)
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

  @Cacheable(CacheTime.ONE_DAY)
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
