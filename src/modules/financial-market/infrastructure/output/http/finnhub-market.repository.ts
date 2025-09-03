import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MarketQuoteRepository } from '../../../domain/repositories/market-quote.repository';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, tap } from 'rxjs';
import { MarketQuoteEntity } from '../../../domain/entities/market-quote.entity';
import { FinnhubQuoteResponseMapper } from './mappers/finnhub-quote.mapper';
import { ConfigService } from '@nestjs/config';
import { FunnhubConfig } from '../../../../../core/settings/settings.model';
import { FinnhubQuoteResponseDto } from './dtos/finnhub-quote.response.dto';

@Injectable()
export class FinnhubMarketRepository implements MarketQuoteRepository {
  private readonly logger = new Logger(FinnhubMarketRepository.name);
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

  async getQuote(ticker: string): Promise<MarketQuoteEntity> {
    const url = `${this.apiUrl}/quote?symbol=${ticker}&token=${this.apiKey}`;
    return firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          this.logger.error(`Error fetching market quote ${error.message}`);
          throw new InternalServerErrorException(
            'Failed to fetch market quote',
          );
        }),
        tap(({ data }: FinnhubQuoteResponseDto) => {
          if (data.c === 0) {
            throw new NotFoundException(`No data found for ticker: ${ticker}`);
          }
        }),
        map(({ data }: FinnhubQuoteResponseDto) =>
          FinnhubQuoteResponseMapper.toEntity(data),
        ),
      ),
    );
  }
}
