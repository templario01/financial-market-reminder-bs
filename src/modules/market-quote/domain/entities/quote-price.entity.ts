export class QuotePriceEntity {
  constructor(
    public readonly currentPrice: number,
    public readonly change: number,
    public readonly percentChange: number,
    public readonly high: number,
    public readonly low: number,
    public readonly open: number,
    public readonly previousClose: number,
    public readonly lastUpdated: Date,
  ) {}
}
