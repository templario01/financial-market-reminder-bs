import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/user-repository';
import { AccessTokenEntity } from '../domain/entities/access-token.entity';
import { LoginDto } from '../infrastructure/input/dtos/request/login.dto';
import { AuthService } from './services/auth.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(data: LoginDto): Promise<AccessTokenEntity> {
    const { email, password } = data;
    const user = await this.userRepository.findUserByEmail(email);
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

    const payload = { username: email, sub: user.id };
    return this.authService.createAccessToken(payload);
  }
}
