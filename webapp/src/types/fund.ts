export interface Fund {
  code: string;
  name: string;
  type: string;
  nav: number;
  navDate: string;
  totalVolume: number;
  manager: string;
}

export interface FundNavHistory {
  date: string;
  nav: number;
  addedNav: number;
}

export interface FundHolding {
  rank: number;
  code: string;
  name: string;
  ratio: number;
  shares: number;
}

export interface FundAnalysis {
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  rating: number;
}

export interface FundSearchResult {
  code: string;
  name: string;
  type: string;
}

export const FUND_TYPE_LABELS: Record<string, string> = {
  stock: '股票型',
  mixed: '混合型',
  bond: '债券型',
  index: '指数型',
  money: '货币型',
};
