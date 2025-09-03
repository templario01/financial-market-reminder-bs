import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class GetEtfRequestDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 6)
  readonly ticker: string;
}
