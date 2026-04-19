import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrendPoint } from '@/types';

interface TrendState {
  trendHistory: TrendPoint[];
  lastRecorded: string | null;

  // Actions
  recordTrendPoint: (totalAssets: number, totalLiabilities: number) => void;
  getTrendHistory: (months?: number) => TrendPoint[];
  clearHistory: () => void;
}

export const useTrendStore = create<TrendState>()(
  persist(
    (set, get) => ({
      trendHistory: [],
      lastRecorded: null,

      recordTrendPoint: (totalAssets: number, totalLiabilities: number) => {
        const now = new Date();
        const today = now.toISOString().split('T')[0] ?? '';
        const lastRecorded = get().lastRecorded;

        // Only record once per day
        if (lastRecorded === today) {
          return;
        }

        const netAssets = totalAssets - totalLiabilities;
        const newPoint: TrendPoint = {
          date: today,
          netAssets,
          totalAssets,
          totalLiabilities,
        };

        set((state) => ({
          trendHistory: [...state.trendHistory, newPoint],
          lastRecorded: today,
        }));
      },

      getTrendHistory: (months?: number) => {
        const history = get().trendHistory;

        if (!months) {
          return history;
        }

        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);
        const cutoffStr = cutoff.toISOString().split('T')[0] ?? '';

        return history.filter((point) => point.date >= cutoffStr);
      },

      clearHistory: () => {
        set({ trendHistory: [], lastRecorded: null });
      },
    }),
    {
      name: 'fund-manager-trend',
      version: 1,
    }
  )
);

// Hook to automatically record trend when assets change
export function useRecordTrend(
  getTotalAssets: () => number,
  getTotalLiabilities: () => number
) {
  const recordTrendPoint = useTrendStore((s) => s.recordTrendPoint);

  // This should be called by the app when needed
  const record = () => {
    recordTrendPoint(getTotalAssets(), getTotalLiabilities());
  };

  return record;
}
