import { create } from 'zustand';
import type { FundInfo, FundNAV, FundHolding, FundDiagnosis } from '@/types';

interface FundState {
  searchResults: FundInfo[];
  selectedFund: FundDiagnosis | null;
  isLoading: boolean;
  error: string | null;
  navHistory: Map<string, FundNAV[]>;
  holdingsCache: Map<string, FundHolding[]>;

  // Actions
  searchFunds: (keyword: string) => Promise<void>;
  selectFund: (code: string) => Promise<void>;
  getFundInfo: (code: string) => Promise<FundInfo | null>;
  getFundNAV: (code: string) => Promise<FundNAV[]>;
  getFundHoldings: (code: string) => Promise<FundHolding[]>;
  clearError: () => void;
  clearSelection: () => void;
}

// Mock fund data for MVP demonstration
const MOCK_FUNDS: Record<string, FundInfo> = {
  '000961': {
    code: '000961',
    name: '天弘沪深300ETF联接A',
    type: '指数型',
    company: '天弘基金管理有限公司',
    manager: '张伟',
    launchDate: '2020-01-01',
    scale: 45.6,
    riskLevel: 4,
  },
  '110022': {
    code: '110022',
    name: '易方达消费行业股票',
    type: '股票型',
    company: '易方达基金管理有限公司',
    manager: '萧楠',
    launchDate: '2010-08-20',
    scale: 268.3,
    riskLevel: 5,
  },
  '161725': {
    code: '161725',
    name: '招商中证白酒指数(LOF)',
    type: '指数型',
    company: '招商基金管理有限公司',
    manager: '侯昊',
    launchDate: '2015-05-27',
    scale: 433.2,
    riskLevel: 5,
  },
};

// Generate mock NAV history
function generateMockNAVHistory(code: string): FundNAV[] {
  const history: FundNAV[] = [];
  const baseNav = code === '000961' ? 1.45 : code === '110022' ? 4.82 : 1.23;
  let nav = baseNav;

  for (let i = 365; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * 0.02;
    nav = nav * (1 + change);
    history.push({
      date: date.toISOString().split('T')[0] ?? '',
      nav: Number(nav.toFixed(4)),
      accNav: Number((nav * 1.1).toFixed(4)),
      changePct: Number((change * 100).toFixed(2)),
    });
  }

  return history;
}

// Generate mock holdings
function generateMockHoldings(code: string): FundHolding[] {
  const holdingsByFund: Record<string, FundHolding[]> = {
    '000961': [
      { rank: 1, name: '贵州茅台', code: '600519', proportion: 5.2, industry: '食品饮料' },
      { rank: 2, name: '宁德时代', code: '300750', proportion: 4.8, industry: '电气设备' },
      { rank: 3, name: '中国平安', code: '601318', proportion: 3.5, industry: '金融' },
      { rank: 4, name: '招商银行', code: '600036', proportion: 3.2, industry: '金融' },
      { rank: 5, name: '比亚迪', code: '002594', proportion: 2.9, industry: '汽车' },
      { rank: 6, name: '美的集团', code: '000333', proportion: 2.7, industry: '家电' },
      { rank: 7, name: '隆基绿能', code: '601012', proportion: 2.5, industry: '电气设备' },
      { rank: 8, name: '恒瑞医药', code: '600276', proportion: 2.3, industry: '医药' },
      { rank: 9, name: '五粮液', code: '000858', proportion: 2.1, industry: '食品饮料' },
      { rank: 10, name: '立讯精密', code: '002475', proportion: 1.9, industry: '电子' },
    ],
    '110022': [
      { rank: 1, name: '贵州茅台', code: '600519', proportion: 9.8, industry: '食品饮料' },
      { rank: 2, name: '五粮液', code: '000858', proportion: 8.5, industry: '食品饮料' },
      { rank: 3, name: '美的集团', code: '000333', proportion: 7.2, industry: '家电' },
      { rank: 4, name: '格力电器', code: '000651', proportion: 6.8, industry: '家电' },
      { rank: 5, name: '伊利股份', code: '600887', proportion: 5.5, industry: '食品饮料' },
      { rank: 6, name: '海尔智家', code: '600690', proportion: 4.8, industry: '家电' },
      { rank: 7, name: '山西汾酒', code: '600809', proportion: 4.2, industry: '食品饮料' },
      { rank: 8, name: '青岛啤酒', code: '600600', proportion: 3.5, industry: '食品饮料' },
      { rank: 9, name: '海天味业', code: '603288', proportion: 3.2, industry: '食品饮料' },
      { rank: 10, name: '泸州老窖', code: '000568', proportion: 2.9, industry: '食品饮料' },
    ],
    '161725': [
      { rank: 1, name: '贵州茅台', code: '600519', proportion: 15.2, industry: '食品饮料' },
      { rank: 2, name: '五粮液', code: '000858', proportion: 12.8, industry: '食品饮料' },
      { rank: 3, name: '泸州老窖', code: '000568', proportion: 9.5, industry: '食品饮料' },
      { rank: 4, name: '山西汾酒', code: '600809', proportion: 8.2, industry: '食品饮料' },
      { rank: 5, name: '洋河股份', code: '002304', proportion: 7.5, industry: '食品饮料' },
      { rank: 6, name: '古井贡酒', code: '000596', proportion: 5.8, industry: '食品饮料' },
      { rank: 7, name: '今世缘', code: '603369', proportion: 4.5, industry: '食品饮料' },
      { rank: 8, name: '口子窖', code: '603589', proportion: 3.8, industry: '食品饮料' },
      { rank: 9, name: '迎驾贡酒', code: '603198', proportion: 3.2, industry: '食品饮料' },
      { rank: 10, name: '水井坊', code: '600779', proportion: 2.8, industry: '食品饮料' },
    ],
  };

  return holdingsByFund[code] ?? [];
}

export const useFundStore = create<FundState>((set, get) => ({
  searchResults: [],
  selectedFund: null,
  isLoading: false,
  error: null,
  navHistory: new Map(),
  holdingsCache: new Map(),

  searchFunds: async (keyword: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const results = Object.values(MOCK_FUNDS).filter(
        (fund) =>
          fund.name.toLowerCase().includes(keyword.toLowerCase()) ||
          fund.code.includes(keyword)
      );

      // If no results, add some mock results
      if (results.length === 0 && keyword.length > 0) {
        results.push({
          code: keyword.padStart(6, '0'),
          name: `${keyword}主题基金`,
          type: '混合型',
          company: '某基金管理有限公司',
          launchDate: '2020-01-01',
          riskLevel: 3,
        });
      }

      set({ searchResults: results, isLoading: false });
    } catch {
      set({ error: '搜索失败，请稍后重试', isLoading: false });
    }
  },

  selectFund: async (code: string) => {
    set({ isLoading: true, error: null });

    try {
      const info = await get().getFundInfo(code);
      if (!info) {
        set({ error: '未找到该基金', isLoading: false });
        return;
      }

      const [navHistory, holdings] = await Promise.all([
        get().getFundNAV(code),
        get().getFundHoldings(code),
      ]);

      // Calculate risk metrics (mock)
      const riskMetrics = {
        volatility: 18.5 + Math.random() * 5,
        maxDrawdown: -(12 + Math.random() * 8),
        sharpeRatio: 0.8 + Math.random() * 0.6,
        correlationToMarket: 0.85 + Math.random() * 0.1,
      };

      // Calculate industry distribution from holdings
      const industryDistribution: Record<string, number> = {};
      holdings.forEach((h) => {
        if (h.industry) {
          industryDistribution[h.industry] = (industryDistribution[h.industry] ?? 0) + h.proportion;
        }
      });

      // Calculate rating (1-5 stars)
      const rating = Math.round(
        (5 - Math.abs(riskMetrics.volatility - 20) / 5) *
          (1 + riskMetrics.sharpeRatio / 2)
      );

      const diagnosis: FundDiagnosis = {
        fundInfo: info,
        navHistory,
        topHoldings: holdings.slice(0, 10),
        industryDistribution,
        riskMetrics,
        rating: Math.max(1, Math.min(5, rating)),
        recommendation: riskMetrics.sharpeRatio > 1.2 ? '推荐持有' : '建议观望',
      };

      set({ selectedFund: diagnosis, isLoading: false });
    } catch {
      set({ error: '获取基金信息失败', isLoading: false });
    }
  },

  getFundInfo: async (code: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_FUNDS[code] ?? null;
  },

  getFundNAV: async (code: string) => {
    const cached = get().navHistory.get(code);
    if (cached) return cached;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const history = generateMockNAVHistory(code);

    set((state) => {
      const newMap = new Map(state.navHistory);
      newMap.set(code, history);
      return { navHistory: newMap };
    });

    return history;
  },

  getFundHoldings: async (code: string) => {
    const cached = get().holdingsCache.get(code);
    if (cached) return cached;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const holdings = generateMockHoldings(code);

    set((state) => {
      const newMap = new Map(state.holdingsCache);
      newMap.set(code, holdings);
      return { holdingsCache: newMap };
    });

    return holdings;
  },

  clearError: () => {
    set({ error: null });
  },

  clearSelection: () => {
    set({ selectedFund: null });
  },
}));