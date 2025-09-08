export class TimeSerieElementQuoteEntity {
  constructor(
    public readonly date: string,
    public readonly open: number,
    public readonly high: number,
    public readonly low: number,
    public readonly close: number,
    public readonly volume: number,
  ) {}
}
