import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUserFavoriteQuoteRepository {
  abstract save(userId: string, quoteId: string): Promise<void>;
  abstract remove(userId: string, quoteId: string): Promise<void>;
}
