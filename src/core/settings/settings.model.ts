export type GlobalConfig = {
  readonly port: number;
  readonly finnhub: FunnhubConfig;
  readonly alphavantage: AlphavantageConfig;
  readonly financialModeling: FinancialModelingConfig;
  readonly auth: AuthConfig;
  readonly mail: MainConfig;
};

export type FunnhubConfig = {
  readonly apiUrl: string;
  readonly apiKey: string;
};

export type AuthConfig = {
  readonly secret: string;
  readonly expiresIn: string;
  readonly google: {
    readonly clientId: string;
  };
};

export type MainConfig = {
  readonly host: string;
  readonly password: string;
  readonly port: number;
  readonly sender: string;
};

export type AlphavantageConfig = {
  readonly apiUrl: string;
  readonly apiKey: string;
};

export class FinancialModelingConfig {
  readonly apiUrl: string;
}
