import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInGoogleDto {
  @ApiProperty({ example: 'token' })
  @IsNotEmpty()
  readonly idToken: string;
}
