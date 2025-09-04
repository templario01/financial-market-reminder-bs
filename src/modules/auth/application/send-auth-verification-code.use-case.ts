import { BadRequestException, Injectable } from '@nestjs/common';
import { IVerificationCodeRepository } from '../domain/repositories/verification-code.repository';
import { generateRandomCode } from '../../../core/common/utils/generate-code';
import { calculateTimeFromNowUntil } from '../../../core/common/utils/calculate-time';
import { IMailerRepository } from '../../../core/common/modules/mail/domain/repositories/email-repository';
import { plainToInstance } from 'class-transformer';
import { SendEmailNotificationEntity } from '../../../core/common/modules/mail/domain/entities/send-email-notification.entity';

@Injectable()
export class SendAuthVerificationCodeUseCase {
  constructor(
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    private readonly mailerRepository: IMailerRepository,
  ) {}

  async execute(email: string): Promise<void> {
    let verificationCode =
      await this.verificationCodeRepository.findByEmail(email);

    const blockedTime = calculateTimeFromNowUntil(-2);

    if (!verificationCode) {
      verificationCode = await this.verificationCodeRepository.save(
        email,
        generateRandomCode(6),
      );
    } else if (verificationCode.updatedAt.getTime() >= blockedTime.getTime()) {
      throw new BadRequestException(
        'Ya solicitaste un código, debes esperar 2 minutos para solicitar uno nuevo',
      );
    } else {
      verificationCode = await this.verificationCodeRepository.update(
        email,
        generateRandomCode(6),
      );
    }

    await this.mailerRepository.sendEmailNotification(
      plainToInstance(SendEmailNotificationEntity, {
        body: { verificationCode: verificationCode.code },
        templateId: 'confirmationUserEmail',
        subject: 'Código de verificación FM Reminder',
        email,
      }),
    );
  }
}
