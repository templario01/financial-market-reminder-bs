import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AddQuoteToFavorite } from '../../application/add-quote-to-favorite';
import { RemoveQuoteFromFavorite } from '../../application/remove-quote-to-favorite';
import { QuoteResponseDto } from '../../../market-quote/infrastructure/input/dtos/quote.response.dto';

@Controller('account-management')
export class AccountManagementController {
  constructor(
    private readonly addQuoteToFavorite: AddQuoteToFavorite,
    private readonly removeQuoteFromFavorite: RemoveQuoteFromFavorite,
  ) {}

  @Post('favorite-quote')
  async addFavoriteQuote(
    @Body() body: { userId: string; quoteId: string },
  ): Promise<QuoteResponseDto> {
    return this.addQuoteToFavorite.execute(body.userId, body.quoteId);
  }

  @Delete('favorite-quote')
  async removeFavoriteQuote(
    @Body() body: { userId: string; quoteId: string },
  ): Promise<QuoteResponseDto> {
    return this.removeQuoteFromFavorite.execute(body.userId, body.quoteId);
  }
}
