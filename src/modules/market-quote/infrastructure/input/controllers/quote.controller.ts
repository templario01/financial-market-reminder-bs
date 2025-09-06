import { Controller, Get, Param } from '@nestjs/common';
import { GetQuoteRequestDto } from '../dtos/get-etf.request.dto';
import { GetQuoteInformationUseCase } from '../../../application/get-quote-information.use-case';
import { QuoteResponseDto } from '../dtos/market-quote.response.dto';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly getQuoteInformationUseCase: GetQuoteInformationUseCase,
  ) {}

  @Get(':ticker')
  async getQuoteInformation(
    @Param() params: GetQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    return this.getQuoteInformationUseCase.execute(params.ticker);
  }
}
