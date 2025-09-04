import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IMailerRepository } from '../domain/repositories/email-repository';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailNotificationEntity } from '../domain/entities/send-email-notification.entity';

@Injectable()
export class NestMailerRepository implements IMailerRepository {
  private readonly logger = new Logger(NestMailerRepository.name);
  constructor(private mailService: MailerService) {}

  async sendEmailNotification({
    templateId,
    email,
    subject,
    body,
  }: SendEmailNotificationEntity): Promise<void> {
    try {
      await this.mailService.sendMail({
        subject,
        to: email,
        template: templateId,
        context: {
          ...body,
        },
      });
    } catch (error) {
      this.logger.error('Fail to send SMTP email', error);
      throw new InternalServerErrorException('Fail to send email');
    }
  }
}
