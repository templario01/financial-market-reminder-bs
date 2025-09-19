export type MarketReportQuote = {
  ticker: string;
  currentPrice: number;
  lastWeekPrice: number;
  change: number;
  percentChange: number;
  linealChartUrl: string;
};

export type MarketReportEntity = {
  title: string;
  description: string;
  quotes: MarketReportQuote[];
};
