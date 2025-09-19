import { Injectable, Logger } from '@nestjs/common';
import { IMailerRepository } from '../domain/repositories/email-repository';
import { SendEmailNotificationEntity } from '../domain/entities/send-email-notification.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from '../../../../settings/settings.model';

@Injectable()
export class MailApiRepository implements IMailerRepository {
  private readonly logger = new Logger(MailApiRepository.name);
  private readonly apiUrl: string;

  constructor(
    private httpService: HttpService,
    private readonly configservice: ConfigService,
  ) {
    this.apiUrl = this.configservice.get<MailConfig>('mail')!.apiUrl;
  }

  sendEmailNotification(request: SendEmailNotificationEntity): void {
    try {
      firstValueFrom(
        this.httpService.post(`${this.apiUrl}/notification`, request),
      );
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`);
    }
  }
}
