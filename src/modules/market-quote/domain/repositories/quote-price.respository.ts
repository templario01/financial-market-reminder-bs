import { Injectable } from '@nestjs/common';
import { CreateQuotePriceEntity } from '../../../market-reminder/domain/entities/create-quote-price.entitiy';

@Injectable()
export abstract class IQuotePriceRepository {
  abstract createMany(quotes: CreateQuotePriceEntity[]): Promise<void>;
}
