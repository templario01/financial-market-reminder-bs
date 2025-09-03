export type GlobalConfig = {
  readonly finnhub: FunnhubConfig;
};

export type FunnhubConfig = {
  readonly apiUrl: string;
  readonly apiKey: string;
};
