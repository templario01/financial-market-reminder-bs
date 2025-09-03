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

export type FinnhubQuoteResponseDto = {
  readonly data: FinnhubQuoteDto;
};
