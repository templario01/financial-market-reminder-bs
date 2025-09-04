import { VerificationCode } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { VerificationCodeEntity } from '../../../domain/entities/verification-code.entity';

export class PrismaVerificationCodeMapper {
  static toEntity(verificationCode: VerificationCode): VerificationCodeEntity {
    return plainToInstance(VerificationCodeEntity, {
      associatedEmail: verificationCode.associatedEmail,
      code: verificationCode.code,
      expirationTime: verificationCode.expirationTime,
      updatedAt: verificationCode.updatedAt,
    } as VerificationCodeEntity);
  }
}
