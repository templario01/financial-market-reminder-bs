import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';

@Injectable()
export class ValidateAuthVerificationCodeUseCase {
  constructor(
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(email: string, code: string): Promise<void> {
    const verificationCode =
      await this.verificationCodeRepository.findByEmail(email);
    if (!verificationCode) {
      throw new NotFoundException(
        'Código de verificación no encontrado, por favor solicite un nuevo código',
      );
    }
    if (verificationCode.code !== code) {
      throw new BadRequestException('Código de verificación inválido');
    }
    if (new Date().getTime() > verificationCode.expirationTime.getTime()) {
      throw new BadRequestException(
        'Código de verificación expirado, por favor solicite un nuevo código',
      );
    }
  }
}
