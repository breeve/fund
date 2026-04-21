import { create } from 'zustand';
import type { FundInfo, FundNAV, FundHolding, FundDiagnosis } from '@/types';
import { searchFunds as apiSearchFunds, getFundInfo as apiGetFundInfo, getFundNAV as apiGetFundNAV, getFundHoldings as apiGetFundHoldings } from '@/services/fundApi';

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
      const results = await apiSearchFunds(keyword);
      set({ searchResults: results, isLoading: false });

      if (results.length === 0) {
        set({ error: '未找到相关基金，请尝试其他关键词' });
      }
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

      // Calculate risk metrics based on real data
      const volatility = calculateVolatility(navHistory);
      const maxDrawdown = calculateMaxDrawdown(navHistory);
      const sharpeRatio = calculateSharpeRatio(navHistory);

      // Calculate industry distribution from holdings
      const industryDistribution: Record<string, number> = {};
      holdings.forEach((h) => {
        if (h.industry) {
          industryDistribution[h.industry] = (industryDistribution[h.industry] ?? 0) + h.proportion;
        }
      });

      // Calculate rating (1-5 stars)
      const rating = Math.round(
        (5 - Math.abs(volatility - 20) / 5) * (1 + sharpeRatio / 2)
      );

      const diagnosis: FundDiagnosis = {
        fundInfo: info,
        navHistory,
        topHoldings: holdings.slice(0, 10),
        industryDistribution,
        riskMetrics: {
          volatility,
          maxDrawdown,
          sharpeRatio,
          correlationToMarket: null,
        },
        rating: Math.max(1, Math.min(5, rating)),
        recommendation: sharpeRatio > 1.2 ? '推荐持有' : '建议观望',
      };

      set({ selectedFund: diagnosis, isLoading: false });
    } catch {
      set({ error: '获取基金信息失败', isLoading: false });
    }
  },

  getFundInfo: async (code: string) => {
    return apiGetFundInfo(code);
  },

  getFundNAV: async (code: string) => {
    const cached = get().navHistory.get(code);
    if (cached) return cached;

    const history = await apiGetFundNAV(code);

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

    const holdings = await apiGetFundHoldings(code);

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

/**
 * Calculate volatility from NAV history
 */
function calculateVolatility(navHistory: FundNAV[]): number {
  if (navHistory.length < 2) return 15;

  const returns: number[] = [];
  for (let i = 1; i < navHistory.length; i++) {
    const prev = navHistory[i - 1];
    const curr = navHistory[i];
    const prevNav = prev?.accNav ?? prev?.nav ?? 0;
    const currNav = curr?.accNav ?? curr?.nav ?? 0;
    if (prevNav > 0) {
      returns.push((currNav - prevNav) / prevNav);
    }
  }

  if (returns.length === 0) return 15;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  // Annualized volatility (assuming 252 trading days)
  return Number((stdDev * Math.sqrt(252) * 100).toFixed(2));
}

/**
 * Calculate max drawdown from NAV history
 */
function calculateMaxDrawdown(navHistory: FundNAV[]): number {
  if (navHistory.length === 0) return 0;

  let maxDrawdown = 0;
  const first = navHistory[0];
  let peak = first?.accNav ?? first?.nav ?? 0;

  for (const point of navHistory) {
    const nav = point?.accNav ?? point?.nav ?? 0;
    if (nav > peak) {
      peak = nav;
    }
    const drawdown = (peak - nav) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return Number((-maxDrawdown * 100).toFixed(2));
}

/**
 * Calculate Sharpe ratio from NAV history
 */
function calculateSharpeRatio(navHistory: FundNAV[]): number {
  if (navHistory.length < 2) return 0.5;

  const returns: number[] = [];
  for (let i = 1; i < navHistory.length; i++) {
    const prev = navHistory[i - 1];
    const curr = navHistory[i];
    const prevNav = prev?.accNav ?? prev?.nav ?? 0;
    const currNav = curr?.accNav ?? curr?.nav ?? 0;
    if (prevNav > 0) {
      returns.push((currNav - prevNav) / prevNav);
    }
  }

  if (returns.length === 0) return 0.5;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Annualized Sharpe ratio (assuming 252 trading days, risk-free rate of 2%)
  const riskFreeRate = 0.02 / 252;
  return Number(((mean - riskFreeRate) / stdDev * Math.sqrt(252)).toFixed(2));
}
