import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { GlobalConfig } from './settings.model';

export class ConfigVariables {
  readonly PORT: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly FINNHUB_API_URL: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly FINNHUB_API_KEY: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly JWT_SECRET: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly JWT_EXPIRES_IN: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly GOOGLE_CLIENT_ID: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly MAIL_HOST: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly MAIL_PASSWORD: string;
  @IsNumberString()
  @IsDefined()
  readonly MAIL_PORT: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly MAIL_SENDER: string;
}

export const configuration = (): GlobalConfig => ({
  port: +process.env.PORT! || 3000,
  finnhub: {
    apiUrl: process.env.FINNHUB_API_URL!,
    apiKey: process.env.FINNHUB_API_KEY!,
  },
  auth: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
    },
  },
  mail: {
    host: process.env.MAIL_HOST!,
    password: process.env.MAIL_PASSWORD!,
    port: +process.env.MAIL_PORT!,
    sender: process.env.MAIL_SENDER!,
  },
});
