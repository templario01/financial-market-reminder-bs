export class CreateUserEntity {
  constructor(
    public readonly email: string,
    public readonly encryptedPassword: string,
  ) {}
}
