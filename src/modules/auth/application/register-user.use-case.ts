import { ConflictException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/user-repository';
import { AuthService } from './services/auth.service';
import { UserEntity } from '../domain/entities/user.entity';
import { CreateUserEntity } from '../domain/entities/create-user.entity';
import { ValidateAuthVerificationCodeUseCase } from './validate-auth-verification-code.use-case';
import { CreateUserDto } from '../infrastructure/input/dtos/request/create-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validateAuthVerificationCodeUseCase: ValidateAuthVerificationCodeUseCase,
    private readonly authService: AuthService,
  ) {}

  async execute(data: CreateUserDto): Promise<UserEntity> {
    const { email, password, verificationCode } = data;
    const [user] = await Promise.all([
      this.userRepository.findUserByEmail(email),
      this.validateAuthVerificationCodeUseCase.execute(email, verificationCode),
    ]);
    if (user) {
      throw new ConflictException('user already registered');
    }
    const encryptedPassword = await this.authService.encryptPassword(password);
    const newUser = await this.userRepository.createUser(
      new CreateUserEntity(email, encryptedPassword),
    );
    return newUser;
  }
}
