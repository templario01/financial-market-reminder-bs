import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MarketEtfResponseDto } from '../infrastructure/input/dtos/etf.response.dto';
import { MarketQuoteRepository } from '../domain/repositories/market-quote.repository';

@Injectable()
export class GetEtfInformationUseCase {
  constructor(private readonly marketQuoteRepository: MarketQuoteRepository) {}

  async execute(ticker: string): Promise<MarketEtfResponseDto> {
    const marketQuote = await this.marketQuoteRepository.getQuote(
      ticker.toUpperCase(),
    );
    return plainToInstance(MarketEtfResponseDto, marketQuote);
  }
}
