export type AssetCategory = 'liquid' | 'fixed' | 'financial' | 'protection' | 'liability';

export interface Asset {
  id: string;
  userId: string;
  category: AssetCategory;
  subCategory?: string;
  name: string;
  amount: number;
  currency: string;
  fields?: Record<string, unknown>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetFormData {
  category: AssetCategory;
  subCategory?: string;
  name: string;
  amount: number;
  currency?: string;
  fields?: Record<string, unknown>;
  tags?: string[];
}

export interface AssetSummary {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  categoryBreakdown: Record<AssetCategory, number>;
}

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  liquid: '流动资产',
  fixed: '固定资产',
  financial: '金融投资',
  protection: '保障资产',
  liability: '负债',
};
