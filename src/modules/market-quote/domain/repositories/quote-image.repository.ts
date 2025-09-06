import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IQuoteImageRepository {
  abstract getImageUrl(ticker: string): Promise<string | null>;
}
