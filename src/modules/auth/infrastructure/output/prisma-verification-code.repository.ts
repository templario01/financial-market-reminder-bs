import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { calculateTimeFromNowUntil } from '../../../../core/common/utils/calculate-time';
import { PrismaVerificationCodeMapper } from './mappers/prisma-verification-code.mapper';
import { VerificationCodeEntity } from '../../domain/entities/verification-code.entity';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';

@Injectable()
export class PrismaVerificationCodeRepository
  implements IVerificationCodeRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(email: string, code: string): Promise<VerificationCodeEntity> {
    const verificationCode = await this.prisma.verificationCode.create({
      data: {
        associatedEmail: email,
        expirationTime: calculateTimeFromNowUntil(5),
        code,
      },
    });
    return PrismaVerificationCodeMapper.toEntity(verificationCode);
  }

  async findByEmail(email: string): Promise<VerificationCodeEntity | null> {
    const verificationCode = await this.prisma.verificationCode.findUnique({
      where: {
        associatedEmail: email,
      },
    });

    return verificationCode
      ? PrismaVerificationCodeMapper.toEntity(verificationCode)
      : null;
  }

  async update(email: string, code: string): Promise<VerificationCodeEntity> {
    const verificationCode = await this.prisma.verificationCode.update({
      where: { associatedEmail: email },
      data: {
        expirationTime: calculateTimeFromNowUntil(5),
        code,
      },
    });
    return PrismaVerificationCodeMapper.toEntity(verificationCode);
  }
}
