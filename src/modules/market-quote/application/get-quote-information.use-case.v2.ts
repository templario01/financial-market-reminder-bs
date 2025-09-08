import { Injectable } from '@nestjs/common';

@Injectable()
export class GetQuoteInformationUseCaseV2 {
  async execute(ticker: string): Promise<string> {
    // Implement the logic for the new use case here
    return Promise.resolve(`Quote information for ${ticker} (v2)`);
  }
}
