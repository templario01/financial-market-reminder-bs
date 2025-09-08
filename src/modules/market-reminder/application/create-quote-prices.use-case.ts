import { IQuotePriceRepository } from '../domain/repositories/quote-price.repository';

export class CreateQuotePricesUseCase {
  constructor(private readonly quotePriceRepository: IQuotePriceRepository) {}

  async execute(): Promise<void> {
    //await this.quotePriceRepository.createMany(quotes);
  }
}
