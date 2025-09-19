export class SendEmailNotificationEntity {
  constructor(
    public readonly templateId: string,
    public readonly email: string,
    public readonly subject: string,
    public readonly fromName: string,
    public readonly body: Record<string, any>,
  ) {}
}
