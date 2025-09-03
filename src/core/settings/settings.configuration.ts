import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { GlobalConfig } from './settings.model';

export class ConfigVariables {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly FINNHUB_API_URL: string;
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly FINNHUB_API_KEY: string;
}

export const configuration = (): GlobalConfig => ({
  finnhub: {
    apiUrl: process.env.FINNHUB_API_URL!,
    apiKey: process.env.FINNHUB_API_KEY!,
  },
});
