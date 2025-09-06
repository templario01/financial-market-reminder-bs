import { Injectable } from '@nestjs/common';
import { IQuoteImageRepository } from '../domain/repositories/quote-image.repository';
import { getDefaultImageUrl } from '../../../core/common/utils/image-builder';

@Injectable()
export class GetQuoteImageUseCase {
  constructor(private readonly quoteImageRepository: IQuoteImageRepository) {}

  async execute(ticker: string): Promise<string | null> {
    const imageUrl = await this.quoteImageRepository.getImageUrl(ticker);
    if (!imageUrl) {
      return getDefaultImageUrl(ticker);
    }
    return imageUrl;
  }
}
