import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationCodeController } from './infrastructure/input/controllers/verification-code.controller';
import { RegisterUserUseCase } from './application/register-user.use-case';
import { SendAuthVerificationCodeUseCase } from './application/send-auth-verification-code.use-case';
import { SignInWithGoogleUseCase } from './application/sign-in-with-google.use-case';
import { IUserRepository } from './domain/repositories/user-repository';
import { PrismaUserRepository } from './infrastructure/output/prisma-user-repository';
import { IVerificationCodeRepository } from './domain/repositories/verification-code.repository';
import { PrismaVerificationCodeRepository } from './infrastructure/output/prisma-verification-code.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from '../../core/settings/settings.model';
import { AuthService } from './application/services/auth.service';
import { GoogleAuthService } from './application/services/google.auth.service';
import { MailModule } from '../../core/common/modules/mail/mail.module';
import { AuthController } from './infrastructure/input/controllers/auth.controller';
import { ValidateAuthVerificationCodeUseCase } from './application/validate-auth-verification-code.use-case';
import { LoginUserUseCase } from './application/login-user.use-case';

export const useCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  SendAuthVerificationCodeUseCase,
  SignInWithGoogleUseCase,
  ValidateAuthVerificationCodeUseCase,
];
const repositories = [
  {
    provide: IUserRepository,
    useClass: PrismaUserRepository,
  },
  {
    provide: IVerificationCodeRepository,
    useClass: PrismaVerificationCodeRepository,
  },
];

@Module({
  imports: [
    MailModule,
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { secret, expiresIn } = configService.get<AuthConfig>('auth')!;
        return Promise.resolve({
          global: true,
          signOptions: { expiresIn },
          secret,
        });
      },
    }),
  ],
  controllers: [AuthController, VerificationCodeController],
  providers: [AuthService, GoogleAuthService, ...useCases, ...repositories],
})
export class AuthModule {}
