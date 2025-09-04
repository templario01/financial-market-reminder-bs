import { Injectable } from '@nestjs/common';
import { SendEmailNotificationEntity } from '../entities/send-email-notification.entity';

@Injectable()
export abstract class IMailerRepository {
  abstract sendEmailNotification(
    data: SendEmailNotificationEntity,
  ): Promise<void>;
}
