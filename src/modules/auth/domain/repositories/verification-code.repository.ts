import { Injectable } from '@nestjs/common';
import { VerificationCodeEntity } from '../../domain/entities/verification-code.entity';

@Injectable()
export abstract class IVerificationCodeRepository {
  abstract save(email: string, code: string): Promise<VerificationCodeEntity>;
  abstract update(email: string, code: string): Promise<VerificationCodeEntity>;
  abstract findByEmail(email: string): Promise<VerificationCodeEntity | null>;
}
