import { create } from 'zustand';
import type { Fund, FundNavHistory, FundHolding, FundAnalysis } from '@/types/fund';
import { fundService } from '@/services/fundService';

interface FundState {
  currentFund: Fund | null;
  navHistory: FundNavHistory[];
  holdings: FundHolding[];
  analysis: FundAnalysis | null;
  loading: boolean;
  fetchFund: (code: string) => Promise<void>;
}

export const useFundStore = create<FundState>((set) => ({
  currentFund: null,
  navHistory: [],
  holdings: [],
  analysis: null,
  loading: false,

  fetchFund: async (code: string) => {
    set({ loading: true });
    const [info, navHistory, holdings, analysis] = await Promise.all([
      fundService.getInfo(code),
      fundService.getNavHistory(code),
      fundService.getHoldings(code),
      fundService.getAnalysis(code),
    ]);
    set({ currentFund: info, navHistory, holdings, analysis, loading: false });
  },
}));
