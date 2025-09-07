export class AccountEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly isActive: boolean,
    public readonly userId: string,
    public readonly alias?: string | null,
  ) {}
}
