import { Controller, Get, Param } from '@nestjs/common';
import { GetEtfRequestDto } from '../dtos/get-etf.request.dto';
import { GetQuoteInformationUseCase } from '../../../application/get-quote-information.use-case';
import { MarketQuoteResponseDto } from '../dtos/market-quote.response.dto';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly getQuoteInformationUseCase: GetQuoteInformationUseCase,
  ) {}

  @Get(':ticker')
  async getQuoteInformation(
    @Param() params: GetEtfRequestDto,
  ): Promise<MarketQuoteResponseDto> {
    return this.getQuoteInformationUseCase.execute(params.ticker);
  }
}
