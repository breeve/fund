import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset, AssetCategory, AssetFilter } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AssetState {
  assets: Asset[];
  filter: AssetFilter;
  lastUpdated: string | null;

  // Actions
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  setFilter: (filter: AssetFilter) => void;
  clearFilter: () => void;

  // Computed getters
  getAssetsByCategory: (category: AssetCategory) => Asset[];
  getFilteredAssets: () => Asset[];
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetAssets: () => number;
  getCategoryBreakdown: () => Record<AssetCategory, number>;
}

// Generate sample data for demo
function generateSampleAssets(): Asset[] {
  const now = new Date().toISOString();

  return [
    {
      id: uuidv4(),
      name: '招商银行活期',
      category: 'liquid' as const,
      subType: '现金类',
      amount: 50000,
      currency: 'CNY',
      institution: '招商银行',
      annualYield: 0.35,
      tags: ['日常备用'],
      notes: '日常开销账户',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '余额宝',
      category: 'liquid' as const,
      subType: '短期理财',
      amount: 80000,
      currency: 'CNY',
      institution: '蚂蚁集团',
      productName: '天弘余额宝货币',
      annualYield: 1.8,
      tags: ['闲钱理财'],
      notes: '',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '沪深300指数基金',
      category: 'financial' as const,
      subType: '基金类',
      amount: 150000,
      currency: 'CNY',
      productCode: '000961',
      quantity: 10000,
      costPrice: 1.2345,
      currentPrice: 1.4567,
      costTotal: 12345,
      marketValue: 14567,
      purchaseDate: '2023-01-15',
      fundCompany: '天弘基金',
      fundType: '指数' as const,
      managementFee: 0.5,
      custodyFee: 0.1,
      institution: '天天基金',
      tags: ['指数基金', '核心资产'],
      notes: '长期持有',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '自住房产',
      category: 'fixed' as const,
      subType: '自用型实物',
      amount: 3000000,
      currency: 'CNY',
      purchaseDate: '2020-06-01',
      purchaseAmount: 2800000,
      currentValue: 3000000,
      holdingPurpose: '自用' as const,
      status: '自住' as const,
      depreciationYears: 70,
      tags: ['房产', '刚需'],
      notes: '三居室，120平',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '住房公积金',
      category: 'protection' as const,
      subType: '社保/公积金',
      amount: 450000,
      currency: 'CNY',
      insuranceType: '社保/公积金' as const,
      coveragePeriod: '终身' as const,
      tags: ['公积金'],
      notes: '公司缴纳基数 15000',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: '房屋贷款',
      category: 'liability' as const,
      subType: '住房负债',
      amount: 1800000,
      currency: 'CNY',
      totalAmount: 2000000,
      paidPrincipal: 200000,
      remainingPrincipal: 1800000,
      remainingTerm: 240,
      interestRate: 4.3,
      rateType: '浮动利率' as const,
      repaymentMethod: '等额本息' as const,
      monthlyPayment: 12000,
      nextPaymentDate: '2024-11-01',
      collateral: '自住房产',
      isCollateralized: true,
      nature: '良性' as const,
      tags: ['房贷'],
      notes: '商业贷款，贷款期限20年',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: generateSampleAssets(),
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
          .filter((a) => a.category !== 'liability')
          .reduce((sum, a) => sum + a.amount, 0);
      },

      getTotalLiabilities: () => {
        return get().assets
          .filter((a) => a.category === 'liability')
          .reduce((sum, a) => sum + a.amount, 0);
      },

      getNetAssets: () => {
        return get().getTotalAssets() - get().getTotalLiabilities();
      },

      getCategoryBreakdown: () => {
        const breakdown: Record<AssetCategory, number> = {
          liquid: 0,
          fixed: 0,
          financial: 0,
          protection: 0,
          liability: 0,
        };

        get().assets.forEach((asset) => {
          breakdown[asset.category] += asset.amount;
        });

        return breakdown;
      },
    }),
    {
      name: 'fund-manager-assets',
      version: 1,
    }
  )
);