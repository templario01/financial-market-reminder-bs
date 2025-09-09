import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/user-repository';
import { AccessTokenEntity } from '../domain/entities/access-token.entity';
import { LoginDto } from '../infrastructure/input/dtos/request/login.dto';
import { AuthService } from './services/auth.service';
import { obfuscateEmail } from '../../../core/common/utils/obfuscate';

@Injectable()
export class LoginUserUseCase {
  private readonly logger = new Logger(LoginUserUseCase.name);
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: LoginDto): Promise<AccessTokenEntity> {
    const { email, password } = data;
    const user =
      await this.userRepository.findUserByEmailIncludingAccount(email);
    if (!user) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña no válidos',
      );
    }
    const isValidPassword = await this.authService.comparePasswords(
      password,
      user.encryptedPassword,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña no válidos',
      );
    }

    if (!user.account) {
      this.logger.error(
        `User with email ${obfuscateEmail(user.email)} has no associated account.`,
      );
      throw new UnauthorizedException('User has no associated account');
    }

    const payload = { username: email, sub: user.account.id };
    return this.authService.createAccessToken(payload);
  }
}
