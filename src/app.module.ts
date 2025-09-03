import { Module } from '@nestjs/common';
import { MarketInstrumentModule } from './modules/market-instrument/market-instrument.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from './core/common/validators/env-validator';
import {
  configuration,
  ConfigVariables,
} from './core/settings/settings.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: (config) => validateEnvs(config, ConfigVariables),
    }),
    MarketInstrumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
