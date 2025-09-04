export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hasActiveNotifications: boolean,
    public readonly isActive: boolean,
    public readonly phoneNumber: string | null,
    public readonly alias: string | null,
  ) {}
}
