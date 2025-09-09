import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GoogleAuthService } from './services/google.auth.service';
import { IUserRepository } from '../domain/repositories/user-repository';
import { AuthService } from './services/auth.service';
import { AuthProviderEntity } from '../domain/entities/auth-provider.entity';
import { obfuscateEmail } from '../../../core/common/utils/obfuscate';

@Injectable()
export class SignInWithGoogleUseCase {
  private readonly logger = new Logger(SignInWithGoogleUseCase.name);
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(googleTokenId: string) {
    const googleUser =
      await this.googleAuthService.verifyIdToken(googleTokenId);

    let user = await this.userRepository.findUserByEmailIncludingAccount(
      googleUser.email,
    );

    if (!user) {
      user = await this.userRepository.createUserByExternalProvider(
        googleUser.email,
        AuthProviderEntity.GOOGLE,
      );
    }

    if (!user.account) {
      this.logger.error(
        `User with email ${obfuscateEmail(googleUser.email)} has no associated account.`,
      );
      throw new UnauthorizedException('User has no associated account');
    }

    const payload = { username: googleUser.email, sub: user.account?.id };
    return this.authService.createAccessToken(payload);
  }
}
