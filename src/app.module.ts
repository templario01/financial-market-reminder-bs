import { Module } from '@nestjs/common';
import { FinancialMarketModule } from './modules/financial-market/financial-market.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from './core/common/validators/env-validator';
import { configuration, ConfigVariables } from './core/settings/settings.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: (config) => validateEnvs(config, ConfigVariables),
    }),
    FinancialMarketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
