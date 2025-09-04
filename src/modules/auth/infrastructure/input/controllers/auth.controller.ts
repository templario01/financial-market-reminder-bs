import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInWithGoogleUseCase } from '../../../application/sign-in-with-google.use-case';
import { RegisterUserUseCase } from '../../../application/register-user.use-case';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UserDto } from '../dtos/response/user.dto';
import { SignInGoogleDto } from '../dtos/request/sign-in-google.dto';
import { AccessTokenDto } from '../dtos/response/access-token.dto';
import { LoginDto } from '../dtos/request/login.dto';
import { LoginUserUseCase } from '../../../application/login-user.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signInWithGoogleUseCase: SignInWithGoogleUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @ApiOperation({ summary: 'register user' })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() request: CreateUserDto): Promise<UserDto> {
    return this.registerUserUseCase.execute(request);
  }

  @ApiOperation({ summary: 'register or signin user with google idToken' })
  @HttpCode(HttpStatus.OK)
  @Post('register/google')
  async googleSignIn(
    @Body() request: SignInGoogleDto,
  ): Promise<AccessTokenDto> {
    return this.signInWithGoogleUseCase.execute(request.idToken);
  }

  @ApiOperation({ summary: 'register or signin user with google idToken' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() request: LoginDto): Promise<AccessTokenDto> {
    return this.loginUserUseCase.execute(request);
  }
}
