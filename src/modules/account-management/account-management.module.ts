import { Module } from '@nestjs/common';
import { GetFavoriteQuotesUseCase } from './application/get-favorite-quotes.use-case';
import { AccountController } from './infrastructure/input/account.controller';
import { AddQuoteToFavoriteUseCase } from './application/add-quote-to-favorite.use-case';
import { RemoveQuoteFromFavoriteUseCase } from './application/remove-quote-to-favorite.use-case';
import { IAccountFavoriteQuoteRepository } from './domain/repositories/user-favorite-quote.repository';
import { PrismaAccountFavoriteQuoteRepository } from './infrastructure/output/prisma-account-favorite-quote.repository';
import { IQuoteRepository } from '../market-quote/domain/repositories/quote.repository';
import { PrismaQuoteRepository } from '../market-quote/infrastructure/output/persistence/prisma-quote.repository';
import { PrismaModule } from '../../core/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { IUserRepository } from '../auth/domain/repositories/user-repository';
import { PrismaUserRepository } from '../auth/infrastructure/output/prisma-user-repository';

const useCases = [
  GetFavoriteQuotesUseCase,
  AddQuoteToFavoriteUseCase,
  RemoveQuoteFromFavoriteUseCase,
];

const repositories = [
  {
    provide: IAccountFavoriteQuoteRepository,
    useClass: PrismaAccountFavoriteQuoteRepository,
  },
  {
    provide: IQuoteRepository,
    useClass: PrismaQuoteRepository,
  },
  {
    provide: IUserRepository,
    useClass: PrismaUserRepository,
  },
];

@Module({
  imports: [PrismaModule, JwtModule, ConfigModule],
  controllers: [AccountController],
  providers: [...useCases, ...repositories],
})
export class AccountManagementModule {}
