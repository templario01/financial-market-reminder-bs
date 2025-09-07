import { Module } from '@nestjs/common';
import { MarketInstrumentModule } from './modules/market-quote/market-instrument.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from './core/common/validators/env-validator';
import {
  configuration,
  ConfigVariables,
} from './core/settings/settings.configuration';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './core/common/modules/mail/infrastructure/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: (config) => validateEnvs(config, ConfigVariables),
    }),
    MarketInstrumentModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
