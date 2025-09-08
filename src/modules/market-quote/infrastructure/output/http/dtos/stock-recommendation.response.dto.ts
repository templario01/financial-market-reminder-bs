export type StockRecommendationResponseDto = {
  readonly buy: number;
  readonly hold: number;
  readonly period: string;
  readonly sell: number;
  readonly strongBuy: number;
  readonly strongSell: number;
  readonly symbol: string;
};
