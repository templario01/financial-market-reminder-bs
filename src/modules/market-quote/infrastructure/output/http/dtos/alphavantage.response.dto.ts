export type MetaData = {
  '1. Information': string;
  '2. Symbol': string;
  '3. Last Refreshed': string;
  '4. Output Size'?: string;
  '4. Time Zone'?: string;
  '5. Time Zone': string;
};

export type DailyTimeSeries = Record<
  string,
  {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  }
>;

export type AdjustedTimeSeries = Record<
  string,
  {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. adjusted close': string;
    '6. volume': string;
    '7. dividend amount': string;
  }
>;

export type AlphavantageDto<
  TKey extends string,
  TSeries extends Record<string, any>,
> = {
  'Meta Data': MetaData;
} & {
  [K in TKey]: TSeries;
};

export type DailyResponse = AlphavantageDto<
  'Time Series (Daily)',
  DailyTimeSeries
>;
export type MonthlyAdjustedResponse = AlphavantageDto<
  'Monthly Adjusted Time Series',
  AdjustedTimeSeries
>;
export type WeeklyAdjustedResponse = AlphavantageDto<
  'Weekly Adjusted Time Series',
  AdjustedTimeSeries
>;

export type AlphavantageResponseDto<T> = {
  readonly data: T;
};
