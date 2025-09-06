import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetQuoteRequestDto } from '../dtos/get-quote.request.dto';
import { GetQuoteInformationUseCase } from '../../../application/get-quote-information.use-case';
import { QuoteResponseDto } from '../dtos/quote.response.dto';
import { ValidateWordPipe } from './pipes/validate-word';
import { GetQuotesBySearchUseCase } from '../../../application/get-quotes-by-search.use-case';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly getQuoteInformationUseCase: GetQuoteInformationUseCase,
    private readonly getQuotesBySearchUseCase: GetQuotesBySearchUseCase,
  ) {}

  @Get('/search')
  async getQuotesBySearch(
    @Query('word', ValidateWordPipe) word: string,
  ): Promise<QuoteResponseDto[]> {
    return this.getQuotesBySearchUseCase.execute(word);
  }

  @Get(':ticker')
  async getQuoteInformation(
    @Param() params: GetQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    return this.getQuoteInformationUseCase.execute(params.ticker);
  }
}
