export class AccessTokenEntity {
  constructor(
    public readonly tokenType: string,
    public readonly token: string,
    public readonly expiresIn: string,
  ) {}
}
