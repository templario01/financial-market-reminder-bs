import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AddQuoteToFavoriteUseCase } from '../../application/add-quote-to-favorite.use-case';
import { RemoveQuoteFromFavoriteUseCase } from '../../application/remove-quote-to-favorite.use-case';
import { QuoteResponseDto } from '../../../market-quote/infrastructure/input/dtos/quote.response.dto';
import { GetFavoriteQuotesUseCase } from '../../application/get-favorite-quotes.use-case';
import { CurrentUser } from '../../../../core/common/decorators/current-user.decorator';
import * as Type from '../../../../core/common/types/types';
import { AuthGuard } from '../../../auth/infrastructure/guards/auth.guard';
import { CreateFavoriteQuoteRequestDto } from './dtos/create-favorite-quote.request.dto';
import { DeleteFavoriteQuoteRequestDto } from './dtos/delete-favorite-quote.request.dto';
import { UpdateAccountSettingsUseCase } from '../../application/update-account-settings.use-case';
import { UpdateAccountRequestDto } from './dtos/update-account.request.dto';
import { AccountResponseDto } from './dtos/account.response.dto';
import { GetAccountInformationUseCase } from '../../application/get-account-information.use-case';
import { plainToInstance } from 'class-transformer';

@Controller('account')
export class AccountController {
  constructor(
    private readonly addQuoteToFavorite: AddQuoteToFavoriteUseCase,
    private readonly removeQuoteFromFavorite: RemoveQuoteFromFavoriteUseCase,
    private readonly getFavoriteQuotes: GetFavoriteQuotesUseCase,
    private readonly updateAccountSettings: UpdateAccountSettingsUseCase,
    private readonly getAccountInformation: GetAccountInformationUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAccountInfo(
    @CurrentUser() user: Type.SessionData,
  ): Promise<AccountResponseDto> {
    const account = await this.getAccountInformation.execute(user.sub);
    return plainToInstance(AccountResponseDto, account as AccountResponseDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  async updateAccount(
    @CurrentUser() user: Type.SessionData,
    @Body() body: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.updateAccountSettings.execute(user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Get('favorite-quote')
  async getAllFavoriteQuotes(
    @CurrentUser() user: Type.SessionData,
  ): Promise<QuoteResponseDto[]> {
    return this.getFavoriteQuotes.execute(user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('favorite-quote')
  async addFavoriteQuote(
    @CurrentUser() user: Type.SessionData,
    @Body() body: CreateFavoriteQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    return this.addQuoteToFavorite.execute(user.sub, body.quoteId);
  }

  @UseGuards(AuthGuard)
  @Delete('favorite-quote')
  async removeFavoriteQuote(
    @CurrentUser() user: Type.SessionData,
    @Body() body: DeleteFavoriteQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    return this.removeQuoteFromFavorite.execute(user.sub, body.quoteId);
  }
}
