// Asset Categories based on disc.md specification
export type AssetCategory =
  | 'fund'          // 基金 - 公募基金
  | 'private_fund'  // 私募基金
  | 'strategy'      // 策略
  | 'fixed'         // 定期
  | 'liquid'        // 活钱
  | 'derivative'    // 金融衍生品
  | 'protection';   // 保障类

// Asset sub-types with tags
export interface AssetSubTypeInfo {
  label: string;
  tags?: string[];
}

export const ASSET_SUB_TYPES: Record<AssetCategory, string[]> = {
  fund: ['A股', 'H股', 'AH', '中美', '全球'],
  private_fund: ['债券策略-长债', '债券策略-短债', '多策略-激进', '多策略-保守', '股票策略'],
  strategy: ['全球精选90', '全球精选100', '股票基金金选', '行业景气度策略', '百分百进攻'],
  fixed: ['银行定期', '股票定期'],
  liquid: ['余额宝', '活期存款'],
  derivative: ['黄金'],
  protection: ['住房公积金', '个人公积金'],
};

// Geographic tags for financial assets
export const GEO_TAGS = ['国内', '全球', '港股'] as const;
export type GeoTag = typeof GEO_TAGS[number];

// Risk level tags
export const RISK_TAGS = ['低风险', '中低风险', '中风险', '中高风险', '高风险'] as const;
export type RiskTag = typeof RISK_TAGS[number];

// Asset source tags
export const SOURCE_TAGS = ['蚂蚁财富', '银行', '其他'] as const;
export type SourceTag = typeof SOURCE_TAGS[number];

// Category display names
export const CATEGORY_NAMES: Record<AssetCategory, string> = {
  fund: '公募基金',
  private_fund: '私募基金',
  strategy: '策略',
  fixed: '定期',
  liquid: '活钱',
  derivative: '金融衍生品',
  protection: '保障',
};

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  fund: '#3b82f6',     // blue
  private_fund: '#8b5cf6', // purple
  strategy: '#ec4899',  // pink
  fixed: '#22c55e',    // green
  liquid: '#f59e0b',    // amber
  derivative: '#f97316', // orange
  protection: '#06b6d4', // cyan
};

// Base Asset interface - common fields for all assets
export interface BaseAsset {
  id: string;
  name: string;
  category: AssetCategory;
  subType: string;
  tags: string[];  // 地域划分 + 风险等级
  notes: string;
  entryTime: string;    // 录入时间 - for trend analysis
  createdAt: string;
  updatedAt: string;
}

// Public Fund (公募基金)
export interface PublicFundAsset extends BaseAsset {
  category: 'fund';
  code?: string;              // 基金编码
  sharpeRatio?: number;       // 夏普比率
  topHoldings?: string[];     // 重仓股票
  source: SourceTag;          // 资产来源
  total: number;              // 总额度(包含本金+收益) — 用户录入
  profit: number;             // 持有收益 — 用户录入
  cost: number;               // 持仓成本 = total - profit — 实时计算
  returnRate: number;         // 持有收益率 = profit / cost * 100 — 实时计算
}

// Private Fund (私募基金)
export interface PrivateFundAsset extends BaseAsset {
  category: 'private_fund';
  code?: string;              // 基金编码
  source: SourceTag;          // 资产来源: 蚂蚁财富
  total: number;              // 总额度(包含本金+收益) — 用户录入
  profit: number;             // 持有收益 — 用户录入
  cost: number;               // 持仓成本 = total - profit — 实时计算
  returnRate: number;         // 持有收益率 = profit / cost * 100 — 实时计算
}

// Strategy (策略)
export interface StrategyAsset extends BaseAsset {
  category: 'strategy';
  source: SourceTag;          // 资产来源: 蚂蚁财富
  total: number;              // 总额度(包含本金+收益) — 用户录入
  profit: number;             // 持有收益 — 用户录入
  cost: number;               // 持仓成本 = total - profit — 实时计算
  returnRate: number;         // 持有收益率 = profit / cost * 100 — 实时计算
}

// Fixed Term (定期)
export interface FixedTermAsset extends BaseAsset {
  category: 'fixed';
  duration: number;           // 年限
  startDate: string;          // 起投日期
  source: SourceTag;          // 资产来源: 银行
  annualReturn: number;       // 年化收益率
  investmentAmount: number;    // 投资金额
}

// Liquid Assets (活钱)
export interface LiquidAsset extends BaseAsset {
  category: 'liquid';
  source: SourceTag;          // 资产来源: 银行
  total: number;              // 总额度
}

// Derivative (金融衍生品)
export interface DerivativeAsset extends BaseAsset {
  category: 'derivative';
  source: SourceTag;          // 资产来源: 银行
  total: number;              // 总额度 — 用户录入
  profit: number;             // 持有收益 — 用户录入
  cost: number;               // 持仓成本 = total - profit — 实时计算
  returnRate: number;         // 持有收益率 = profit / cost * 100 — 实时计算
}

// Protection (保障)
export interface ProtectionAsset extends BaseAsset {
  category: 'protection';
  // subType already in base: 住房公积金, 个人公积金
}

// Union type for all assets
export type Asset = PublicFundAsset | PrivateFundAsset | StrategyAsset | FixedTermAsset | LiquidAsset | DerivativeAsset | ProtectionAsset;

// Fund types for diagnosis
export interface FundInfo {
  code: string;
  name: string;
  type: string;
  company: string;
  manager?: string;
  launchDate: string;
  scale?: number;
  riskLevel?: number;
}

export interface FundNAV {
  date: string;
  nav: number;
  accNav?: number;
  changePct: number;
}

export interface FundHolding {
  rank: number;
  name: string;
  code?: string;
  proportion: number;
  industry?: string;
}

export interface FundDiagnosis {
  fundInfo: FundInfo;
  navHistory: FundNAV[];
  topHoldings: FundHolding[];
  industryDistribution?: Record<string, number>;
  riskMetrics: {
    volatility: number;       // 波动率
    maxDrawdown: number;      // 最大回撤
    sharpeRatio: number;      // 夏普比率
    correlationToMarket: number;
  };
  rating: number;             // 1-5 星
  recommendation?: string;
}

// Analysis types
export interface BalanceSheet {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  categoryBreakdown: Record<AssetCategory, number>;
}

export interface TrendPoint {
  date: string;
  netAssets: number;
  totalAssets: number;
  totalLiabilities: number;
}

// Configuration
export interface AppConfig {
  marketDataProvider: string;
  llmProvider: string;
  llmModel: string;
  theme: 'light' | 'dark' | 'auto';
  locale: string;
  dataDir: string;
  // Custom API endpoints (for advanced users)
  customApiEndpoints?: {
    fundSearch?: string;    // 基金搜索 API
    fundInfo?: string;     // 基金信息 API
    fundNav?: string;      // 基金净值 API
    fundHoldings?: string; // 基金持仓 API
  };
}

// Filter types
export interface AssetFilter {
  category?: AssetCategory;
  subType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search?: string;
}

// Export formats
export type ExportFormat = 'json' | 'csv' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  includeHistory?: boolean;
  categories?: AssetCategory[];
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  locale: string;
  defaultView: 'overview' | 'list' | 'charts';
  dateFormat: string;
  currency: string;
  showTips: boolean;
}

// Asset adjustment record - for trend tracking
export interface AssetAdjustment {
  id: string;
  assetId: string;           // Original asset this adjustment belongs to
  adjustedAt: string;         // When the adjustment was made
  previousValue: number;     // Value before adjustment
  newValue: number;          // Value after adjustment
  changeReason?: string;      // Reason for adjustment
}

// Helper type guards
export function isPublicFund(asset: Asset): asset is PublicFundAsset {
  return asset.category === 'fund';
}

export function isPrivateFund(asset: Asset): asset is PrivateFundAsset {
  return asset.category === 'private_fund';
}

export function isStrategy(asset: Asset): asset is StrategyAsset {
  return asset.category === 'strategy';
}

export function isFixedTerm(asset: Asset): asset is FixedTermAsset {
  return asset.category === 'fixed';
}

export function isLiquid(asset: Asset): asset is LiquidAsset {
  return asset.category === 'liquid';
}

export function isDerivative(asset: Asset): asset is DerivativeAsset {
  return asset.category === 'derivative';
}

export function isProtection(asset: Asset): asset is ProtectionAsset {
  return asset.category === 'protection';
}

// Calculate return rate: returnRate = profit / cost * 100
export function calculateReturnRate(profit: number, cost: number): number {
  if (cost === 0) return 0;
  return (profit / cost) * 100;
}

/**
 * 根据用户录入的 total 和 profit，实时计算持仓成本和收益率
 * cost = total - profit
 * returnRate = profit / cost * 100
 */
export function calculateHoldingMetrics(total: number, profit: number): { cost: number; returnRate: number } {
  const cost = total - profit;
  const returnRate = calculateReturnRate(profit, cost);
  return { cost, returnRate };
}
