import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IQuoteImageRepository } from '../../../domain/repositories/quote-image.repository';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FinancialModelingConfig } from '../../../../../core/settings/settings.model';

@Injectable()
export class FinancialModelingRepository implements IQuoteImageRepository {
  private readonly logger = new Logger(FinancialModelingRepository.name);
  private readonly apiUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { apiUrl } =
      this.configService.get<FinancialModelingConfig>('financialModeling')!;
    this.apiUrl = apiUrl;
  }

  async getImageUrl(ticker: string): Promise<string | null> {
    const imageUrl = `${this.apiUrl}/image-stock/${ticker}.png`;
    return firstValueFrom(
      this.httpService.get(imageUrl).pipe(
        map((response) => {
          if ((response.status as HttpStatus) !== HttpStatus.OK) {
            return null;
          }
          return imageUrl;
        }),
      ),
    );
  }
}
