import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteQuoteRequestDto {
  @IsNotEmpty()
  quoteId: string;
}
