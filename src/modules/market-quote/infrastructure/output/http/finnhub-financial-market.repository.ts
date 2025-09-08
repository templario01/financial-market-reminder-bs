import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IFinancialMarketRepository } from '../../../domain/repositories/financial-market.repository';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { FunnhubConfig } from '../../../../../core/settings/settings.model';
import {
  FinnhubApiResponseDto,
  FinnhubQuoteDto,
  FinnhubSymbolDto,
} from './dtos/finnhub-quote.response.dto';
import { ExternalQuotePriceEntity } from '../../../domain/entities/quote-price.entity';
import { FinnhubQuotePriceResponseMapper } from './mappers/finnhub-quote-price.mapper';
import { FinnhubQuoteInformationMapper } from './mappers/finnhub-quote-information.mapper';
import { ExternalQuoteEntity } from '../../../domain/entities/quote.entity';
import { StockRecommendationResponseDto } from './dtos/stock-recommendation.response.dto';
import { StockRecommendationEntityMapper } from './mappers/stock-recommendation-entity.mapper';
import { StockRecommendationEntity } from '../../../domain/entities/stock-recommendation.entity';

@Injectable()
export class FinnhubFinancialMarketRepository
  implements IFinancialMarketRepository
{
  private readonly logger = new Logger(FinnhubFinancialMarketRepository.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { apiKey, apiUrl } =
      this.configService.get<FunnhubConfig>('finnhub')!;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async getQuotePrice(ticker: string): Promise<ExternalQuotePriceEntity> {
    const url = `${this.apiUrl}/quote?symbol=${ticker}&token=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(`Error fetching market quote ${error.message}`);
          throw new InternalServerErrorException(
            'Failed to fetch market quote',
          );
        }),
        tap(({ data }: FinnhubApiResponseDto<FinnhubQuoteDto>) => {
          if (data.c === 0) {
            throw new NotFoundException(`No data found for ticker: ${ticker}`);
          }
        }),
        map(({ data }: FinnhubApiResponseDto<FinnhubQuoteDto>) =>
          FinnhubQuotePriceResponseMapper.toEntity(data),
        ),
      ),
    );
  }

  async getQuoteInformation(
    ticker: string,
  ): Promise<ExternalQuoteEntity | null> {
    const url = `${this.apiUrl}/search?q=${ticker}&exchange=US&token=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(
            `Error fetching market quote information ${error.message}`,
          );
          throw new InternalServerErrorException(
            'Failed to fetch market quote information',
          );
        }),
        map(({ data }: FinnhubApiResponseDto<FinnhubSymbolDto>) => {
          const quote = data.result.find((quote) => quote.symbol === ticker);
          if (!quote) return null;
          return FinnhubQuoteInformationMapper.toEntity(quote);
        }),
      ),
    );
  }

  async getRecommendation(stock: string): Promise<StockRecommendationEntity[]> {
    const url = `${this.apiUrl}/stock/recommendation?symbol=${stock}&exchange=US&token=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(
            `Error fetching market quote information ${error.message}`,
          );
          throw new InternalServerErrorException(
            'Failed to fetch market quote information',
          );
        }),
        map(
          ({ data }: FinnhubApiResponseDto<StockRecommendationResponseDto[]>) =>
            data.map((stockRecommendation) =>
              StockRecommendationEntityMapper.toEntity(stockRecommendation),
            ),
        ),
      ),
    );
  }
}
