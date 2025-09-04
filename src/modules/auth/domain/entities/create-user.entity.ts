export class CreateUserEntity {
  constructor(
    public readonly email: string,
    public readonly encryptedPassword: string,
    public readonly hasActiveNotifications?: boolean,
    public readonly alias?: string,
  ) {
    this.hasActiveNotifications = hasActiveNotifications ?? false;
  }
}
