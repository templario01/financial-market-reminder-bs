export class StockRecommendationEntity {
  constructor(
    public symbol: string,
    public period: string,
    public buy: number,
    public hold: number,
    public sell: number,
    public strongBuy: number,
    public strongSell: number,
  ) {}
}
