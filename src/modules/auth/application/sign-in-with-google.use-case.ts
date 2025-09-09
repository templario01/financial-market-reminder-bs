import { Injectable, Logger } from '@nestjs/common';
import { GoogleAuthService } from './services/google.auth.service';
import { IUserRepository } from '../domain/repositories/user-repository';
import { AuthService } from './services/auth.service';
import { AuthProviderEntity } from '../domain/entities/auth-provider.entity';

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

    let user = await this.userRepository.findUserByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepository.createUserByExternalProvider(
        googleUser.email,
        AuthProviderEntity.GOOGLE,
      );
    }

    const payload = { username: googleUser.email, sub: user.account?.id };
    return this.authService.createAccessToken(payload);
  }
}
