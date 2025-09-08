export class MetadataQuoteEntity {
  constructor(
    public readonly information: string,
    public readonly symbol: string,
    public readonly lastRefreshed: string,
    public readonly interval: string,
    public readonly timeZone: string,
    public readonly outputSize?: string | null,
  ) {}
}
