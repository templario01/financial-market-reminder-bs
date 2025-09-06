export type FinnhubQuoteDto = {
  readonly c: number;
  readonly d: number;
  readonly dp: number;
  readonly h: number;
  readonly l: number;
  readonly o: number;
  readonly pc: number;
  readonly t: number;
};

export type FinnhubSymbolInformationDto = {
  readonly description: string;
  readonly displaySymbol: string;
  readonly symbol: string;
  readonly type: string;
};

export type FinnhubSymbolDto = {
  readonly count: number;
  readonly result: FinnhubSymbolInformationDto[];
};

export type FinnhubApiResponseDto<T> = {
  readonly data: T;
};
