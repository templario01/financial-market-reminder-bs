import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  readonly password: string;
}
