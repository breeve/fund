import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset, AssetCategory, AssetFilter, AssetAdjustment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AssetState {
  assets: Asset[];
  adjustments: AssetAdjustment[];  // Track asset adjustments for trend analysis
  filter: AssetFilter;
  lastUpdated: string | null;

  // Actions
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  /** 调整资产 - 创建新记录而非编辑，保留历史供趋势分析 */
  adjustAsset: (id: string, newValues: Partial<Asset>, reason?: string) => Asset;
  deleteAsset: (id: string) => void;
  setFilter: (filter: AssetFilter) => void;
  clearFilter: () => void;

  // Computed getters
  getAssetsByCategory: (category: AssetCategory) => Asset[];
  getFilteredAssets: () => Asset[];
  getTotalAssets: () => number;
  getNetAssets: () => number;
  getCategoryBreakdown: () => Record<AssetCategory, number>;
  /** 获取资产的历史调整记录 */
  getAssetAdjustments: (assetId: string) => AssetAdjustment[];
}

// Generate sample data for demo
function generateSampleAssets(): Asset[] {
  const now = new Date().toISOString();
  const entryTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago

  return [
    // 活钱 (Liquid)
    {
      id: uuidv4(),
      name: '余额宝',
      category: 'liquid' as const,
      subType: '余额宝',
      source: '蚂蚁财富' as const,
      total: 80000,
      tags: ['国内', '低风险'],
      notes: '日常开销账户',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '招行活期',
      category: 'liquid' as const,
      subType: '活期存款',
      source: '银行' as const,
      total: 50000,
      tags: ['国内', '低风险'],
      notes: '日常备用金',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 公募基金 (Public Fund)
    {
      id: uuidv4(),
      name: '沪深300指数基金',
      category: 'fund' as const,
      subType: 'A股',
      code: '000961',
      sharpeRatio: 0.85,
      topHoldings: ['贵州茅台', '宁德时代', '招商银行'],
      source: '蚂蚁财富' as const,
      total: 150000,
      cost: 123450,
      profit: 26550,
      returnRate: 21.51,
      tags: ['国内', '中风险'],
      notes: '长期持有',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 私募基金 (Private Fund)
    {
      id: uuidv4(),
      name: 'XX债券策略',
      category: 'private_fund' as const,
      subType: '债券策略-长债',
      code: 'PF2023001',
      source: '蚂蚁财富' as const,
      total: 500000,
      cost: 500000,
      profit: 35000,
      returnRate: 7.0,
      tags: ['国内', '中低风险'],
      notes: '一年期已到期',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 策略 (Strategy)
    {
      id: uuidv4(),
      name: '全球精选90',
      category: 'strategy' as const,
      subType: '全球精选90',
      source: '蚂蚁财富' as const,
      total: 300000,
      cost: 280000,
      profit: 20000,
      returnRate: 7.14,
      tags: ['全球', '中风险'],
      notes: '全球分散配置',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 定期 (Fixed Term)
    {
      id: uuidv4(),
      name: '工商银行定期',
      category: 'fixed' as const,
      subType: '银行定期',
      duration: 1,
      startDate: '2024-01-15',
      source: '银行' as const,
      annualReturn: 2.1,
      investmentAmount: 200000,
      tags: ['国内', '低风险'],
      notes: '一年期定期',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 金融衍生品 (Derivative)
    {
      id: uuidv4(),
      name: '黄金ETF',
      category: 'derivative' as const,
      subType: '黄金',
      source: '银行' as const,
      total: 100000,
      cost: 85000,
      profit: 15000,
      returnRate: 17.65,
      tags: ['全球', '中高风险'],
      notes: '避险资产配置',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    // 保障 (Protection)
    {
      id: uuidv4(),
      name: '住房公积金',
      category: 'protection' as const,
      subType: '住房公积金',
      tags: ['国内'],
      notes: '公司缴纳基数 15000',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '个人公积金',
      category: 'protection' as const,
      subType: '个人公积金',
      tags: ['国内'],
      notes: '自缴基数 5000',
      entryTime,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: generateSampleAssets(),
      adjustments: [],
      filter: {},
      lastUpdated: new Date().toISOString(),

      addAsset: (assetData) => {
        const now = new Date().toISOString();
        const newAsset = {
          ...assetData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        } as Asset;

        set((state) => ({
          assets: [...state.assets, newAsset],
          lastUpdated: now,
        }));

        return newAsset;
      },

      updateAsset: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id
              ? ({ ...asset, ...updates, updatedAt: now } as Asset)
              : asset
          ),
          lastUpdated: now,
        }));
      },

      /** 调整资产 - 创建新记录保留历史，原始资产标记为已调整 */
      adjustAsset: (id, newValues, reason) => {
        const now = new Date().toISOString();
        const originalAsset = get().assets.find((a) => a.id === id);
        if (!originalAsset) {
          throw new Error(`Asset with id ${id} not found`);
        }

        // Create adjustment record for trend tracking
        const adjustment: AssetAdjustment = {
          id: uuidv4(),
          assetId: id,
          adjustedAt: now,
          previousValue: 'total' in originalAsset ? originalAsset.total :
                        'investmentAmount' in originalAsset ? originalAsset.investmentAmount : 0,
          newValue: 'total' in (newValues as Record<string, unknown>) ? (newValues as { total?: number }).total ?? 0 :
                   'investmentAmount' in (newValues as Record<string, unknown>) ? (newValues as { investmentAmount?: number }).investmentAmount ?? 0 : 0,
          changeReason: reason,
        };

        // Create new asset record with adjusted values and new entry time
        const newAsset = {
          ...originalAsset,
          ...newValues,
          id: uuidv4(),
          entryTime: now,  // New entry time for trend analysis
          createdAt: now,
          updatedAt: now,
        } as Asset;

        set((state) => ({
          assets: [...state.assets, newAsset],
          adjustments: [...state.adjustments, adjustment],
          lastUpdated: now,
        }));

        return newAsset;
      },

      deleteAsset: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
          lastUpdated: now,
        }));
      },

      setFilter: (filter) => {
        set({ filter });
      },

      clearFilter: () => {
        set({ filter: {} });
      },

      getAssetsByCategory: (category) => {
        return get().assets.filter((asset) => asset.category === category);
      },

      getFilteredAssets: () => {
        const { assets, filter } = get();

        return assets.filter((asset) => {
          if (filter.category && asset.category !== filter.category) return false;
          if (filter.subType && asset.subType !== filter.subType) return false;
          if (filter.dateRange) {
            const entryTime = new Date(asset.entryTime);
            if (filter.dateRange.start && entryTime < new Date(filter.dateRange.start)) return false;
            if (filter.dateRange.end && entryTime > new Date(filter.dateRange.end)) return false;
          }
          if (filter.search) {
            const search = filter.search.toLowerCase();
            if (
              !asset.name.toLowerCase().includes(search) &&
              !asset.tags.some((t) => t.toLowerCase().includes(search))
            ) {
              return false;
            }
          }
          return true;
        });
      },

      getTotalAssets: () => {
        return get().assets
          .reduce((sum, a) => {
            if ('total' in a) return sum + (a.total || 0);
            if ('investmentAmount' in a) return sum + (a.investmentAmount || 0);
            return sum;
          }, 0);
      },

      getNetAssets: () => {
        return get().getTotalAssets();
      },

      getCategoryBreakdown: () => {
        const breakdown: Record<AssetCategory, number> = {
          fund: 0,
          private_fund: 0,
          strategy: 0,
          fixed: 0,
          liquid: 0,
          derivative: 0,
          protection: 0,
        };

        get().assets.forEach((asset) => {
          if ('total' in asset) {
            breakdown[asset.category] += asset.total || 0;
          } else if ('investmentAmount' in asset) {
            breakdown[asset.category] += asset.investmentAmount || 0;
          }
        });

        return breakdown;
      },

      getAssetAdjustments: (assetId) => {
        return get().adjustments.filter((adj) => adj.assetId === assetId);
      },
    }),
    {
      name: 'fund-manager-assets',
      version: 2,  // Bump version for new schema
    }
  )
);
