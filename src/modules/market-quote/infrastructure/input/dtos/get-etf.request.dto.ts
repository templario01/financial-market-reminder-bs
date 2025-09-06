import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class GetQuoteRequestDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 6)
  readonly ticker: string;
}
