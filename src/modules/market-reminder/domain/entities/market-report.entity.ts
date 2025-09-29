export type MarketReportQuote = {
  ticker: string;
  currentPrice: number;
  lastWeekPrice: number;
  change: number;
  percentChange: number;
  linealChartUrl: string;
};

export type MarketReportQuoteMonthly = {
  ticker: string;
  currentPrice: number;
  lastMonthPrice: number;
  change: number;
  percentChange: number;
  linealChartUrl: string;
};

export type MarketReportEntity = {
  title: string;
  description: string;
  quotes: MarketReportQuote[] | MarketReportQuoteMonthly[];
};
