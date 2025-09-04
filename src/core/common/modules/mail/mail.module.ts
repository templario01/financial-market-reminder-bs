import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MainConfig } from '../../../settings/settings.model';
import { IMailerRepository } from './domain/repositories/email-repository';
import { NestMailerRepository } from './infrastructure/nest-mailer.repository';

const repositories = [
  { provide: IMailerRepository, useClass: NestMailerRepository },
];

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MailerOptions> => {
        const { host, password, port, sender } =
          configService.get<MainConfig>('mail')!;
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
