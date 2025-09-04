import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendVerificationCodeDto } from '../dtos/request/send-verification-code.dto';
import { SendAuthVerificationCodeUseCase } from '../../../application/send-auth-verification-code.use-case';

@ApiTags('auth/verification-code')
@Controller('auth/verification-code')
export class VerificationCodeController {
  constructor(
    private readonly sendAuthVerificationCodeUseCase: SendAuthVerificationCodeUseCase,
  ) {}

  @ApiOperation({ summary: 'Send verification code' })
  @HttpCode(HttpStatus.OK)
  @Post()
  async sendVerificationCode(
    @Body() { email }: SendVerificationCodeDto,
  ): Promise<void> {
    return this.sendAuthVerificationCodeUseCase.execute(email);
  }
}
