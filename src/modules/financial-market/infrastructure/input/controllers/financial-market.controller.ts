import { Controller, Get, Param } from '@nestjs/common';
import { GetEtfInformationUseCase } from '../../../application/get-etf-price.use-case';
import { GetEtfRequestDto } from '../dtos/get-etf.request.dto';
import { MarketEtfResponseDto } from '../dtos/etf.response.dto';

@Controller('financial-market')
export class FinancialMarketController {
  constructor(
    private readonly getEtfInformationUseCase: GetEtfInformationUseCase,
  ) {}

  @Get('etf/:ticker')
  async getEtfInformation(
    @Param() params: GetEtfRequestDto,
  ): Promise<MarketEtfResponseDto> {
    console.log(`Fetching ETF information for ticker: ${params.ticker}`);
    return this.getEtfInformationUseCase.execute(params.ticker);
  }
}
