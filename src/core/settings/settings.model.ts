export type GlobalConfig = {
  readonly finnhub: FunnhubConfig;
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
