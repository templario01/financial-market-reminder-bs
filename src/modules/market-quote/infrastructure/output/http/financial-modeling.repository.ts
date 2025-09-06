import { HttpStatus, Injectable } from '@nestjs/common';
import { IQuoteImageRepository } from '../../../domain/repositories/quote-image.repository';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FinancialModelingRepository implements IQuoteImageRepository {
  constructor(private readonly httpService: HttpService) {}

  async getImageUrl(ticker: string): Promise<string | null> {
    const imageUrl = `https://financialmodelingprep.com/image-stock/${ticker}.png`;
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
