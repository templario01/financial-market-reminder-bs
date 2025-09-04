export class VerificationCodeEntity {
  constructor(
    public readonly code: string,
    public readonly associatedEmail: string,
    public readonly updatedAt: Date,
    public readonly expirationTime: Date,
  ) {}
}
