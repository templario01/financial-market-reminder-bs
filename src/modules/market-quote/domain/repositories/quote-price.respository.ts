import { Injectable } from '@nestjs/common';
import { CreateQuotePriceEntity } from '../../../market-reminder/domain/entities/create-quote-price.entitiy';
import { QuotePriceEntity } from '../entities/quote-price.entity';

@Injectable()
export abstract class IQuotePriceRepository {
  abstract createMany(quotes: CreateQuotePriceEntity[]): Promise<void>;
  abstract findAllByQuoteIdBetweenDates(
    quoteId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<QuotePriceEntity[]>;
}
