import { Module } from '@nestjs/common';
import { MarketInstrumentModule } from './modules/market-quote/market-instrument.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from './core/common/validators/env-validator';
import {
  configuration,
  ConfigVariables,
} from './core/settings/settings.configuration';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: (config) => validateEnvs(config, ConfigVariables),
    }),
    MarketInstrumentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
