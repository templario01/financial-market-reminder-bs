import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty({ example: 'ABC123' })
  @IsAlphanumeric()
  @IsNotEmpty()
  readonly verificationCode: string;
}
