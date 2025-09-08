import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { GetQuoteRequestDto } from '../dtos/get-quote.request.dto';
import { GetQuoteInformationUseCase } from '../../../application/get-quote-information.use-case';
import { QuoteResponseDto } from '../dtos/quote.response.dto';
import { ValidateWordPipe } from './pipes/validate-word';
import { GetQuotesBySearchUseCase } from '../../../application/get-quotes-by-search.use-case';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CacheTime } from '../../../../../core/common/enums/cache-ttl';

@UseInterceptors(CacheInterceptor)
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

  @CacheTTL(CacheTime.THIRTY_SECONDS)
  @Get(':ticker')
  async getQuoteInformation(
    @Param() params: GetQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    return this.getQuoteInformationUseCase.execute(params.ticker);
  }
}
