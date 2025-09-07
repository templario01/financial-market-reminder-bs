export type NonUndefinedProps<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: Exclude<T[P], undefined>;
};

export type SessionData = {
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
  readonly username: string;
};
