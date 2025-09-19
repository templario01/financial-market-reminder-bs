import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { IMailerRepository } from './domain/repositories/email-repository';
import { MailApiRepository } from './infrastructure/mail-api.repository';
import { MailConfig } from '../../../settings/settings.model';
import { HttpModule } from '@nestjs/axios';

const repositories = [
  { provide: IMailerRepository, useClass: MailApiRepository },
];

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MailerOptions> => {
        const { host, password, port, sender } =
          configService.get<MailConfig>('mail')!;
        return Promise.resolve({
          transport: {
            host,
            port,
            secure: true,
            auth: {
              user: sender,
              pass: password,
            },
          },
          defaults: {
            from: '"FM Reminder" <noreply@example.com>',
          },
          template: {
            dir: join(__dirname, '..', 'mail', 'infrastructure', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        });
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [...repositories],
  exports: [...repositories],
})
export class MailModule {}
