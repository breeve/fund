// Asset Categories based on technical specification
export type AssetCategory =
  | 'liquid'        // 流动资产
  | 'fixed'         // 固定资产
  | 'financial'     // 金融投资
  | 'protection'    // 保障类
  | 'liability';    // 负债

// Asset sub-types
export const ASSET_SUB_TYPES: Record<AssetCategory, string[]> = {
  liquid: ['现金类', '短期理财', '可快速变现类'],
  fixed: ['自用型实物', '投资型实物', '投资型权益'],
  financial: ['权益类', '固定收益类', '基金类', '另类投资', '衍生品'],
  protection: ['健康险', '意外险', '寿险', '年金险', '社保/公积金'],
  liability: ['住房负债', '消费负债', '信用负债', '其他负债'],
};

// Category display names
export const CATEGORY_NAMES: Record<AssetCategory, string> = {
  liquid: '流动资产',
  fixed: '固定资产',
  financial: '金融投资',
  protection: '保障类',
  liability: '负债',
};

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  liquid: '#22c55e',    // green
  fixed: '#3b82f6',     // blue
  financial: '#8b5cf6', // purple
  protection: '#f59e0b', // amber
  liability: '#ef4444', // red
};

// Base Asset interface
export interface BaseAsset {
  id: string;
  name: string;
  category: AssetCategory;
  subType: string;
  amount: number;
  currency: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Liquid Assets
export interface LiquidAsset extends BaseAsset {
  category: 'liquid';
  institution?: string;       // 开户机构
  productName?: string;       // 产品名称
  annualYield?: number;       // 年化收益率
  lastChangeDate?: string;    // 最近一次变动日期
}

// Fixed Assets
export interface FixedAsset extends BaseAsset {
  category: 'fixed';
  purchaseDate: string;       // 购买日期
  purchaseAmount: number;     // 购买金额
  currentValue: number;       // 当前估值
  holdingPurpose: '自用' | '投资';
  status: '自住' | '出租' | '空置';
  monthlyRent?: number;       // 月租金
  leaseEndDate?: string;      // 租约到期日
  loanAmount?: number;        // 贷款金额
  loanRate?: number;          // 贷款利率
  loanRemainingTerm?: number; // 剩余期限(月)
  monthlyPayment?: number;    // 月供
  depreciationYears?: number; // 折旧年限
}

// Financial Investment Assets
export interface FinancialAsset extends BaseAsset {
  category: 'financial';
  productCode?: string;       // 产品代码
  quantity?: number;          // 持有数量/份额
  costPrice?: number;         // 成本单价
  currentPrice?: number;      // 当前单价
  costTotal?: number;         // 成本总额
  marketValue?: number;       // 当前市值
  purchaseDate?: string;      // 买入日期
  dividendRecord?: string;    // 分红记录
  institution?: string;       // 账户所在机构
  // 基金特定
  fundCompany?: string;       // 基金公司
  fundType?: '主动' | '指数'; // 基金类型
  managementFee?: number;     // 管理费
  custodyFee?: number;        // 托管费
  // 股票特定
  exchange?: string;          // 交易所
  industry?: string;          // 行业
  weight?: number;            // 权重
}

// Protection Assets
export interface ProtectionAsset extends BaseAsset {
  category: 'protection';
  insuranceCompany?: string;  // 保险公司
  policyNumber?: string;      // 保单号
  insuranceType: '健康险' | '意外险' | '寿险' | '年金险' | '社保/公积金';
  coverageAmount?: number;    // 保障额度/保额
  annualPremium?: number;     // 年缴保费
  paymentYears?: number;      // 缴费年限
  paidYears?: number;         // 已缴费年限
  remainingPaymentYears?: number; // 剩余缴费年限
  coveragePeriod: '终身' | `至${number}岁` | '一年期';
  cashValue?: number;         // 现金价值
  waitingPeriod?: string;     // 等待期
  exclusionSummary?: string;  // 责任免除摘要
}

// Liability Assets
export interface LiabilityAsset extends BaseAsset {
  category: 'liability';
  creditor?: string;          // 债权人
  totalAmount: number;        // 贷款总额
  paidPrincipal?: number;     // 已还本金
  remainingPrincipal: number; // 剩余本金
  remainingTerm?: number;     // 剩余期限(月)
  interestRate?: number;      // 贷款利率
  rateType: '浮动利率' | '固定利率';
  repaymentMethod: '等额本息' | '等额本金' | '先息后本';
  monthlyPayment?: number;    // 月供金额
  nextPaymentDate?: string;   // 下次还款日
  collateral?: string;        // 抵押物
  isCollateralized?: boolean; // 是否已抵押
  nature: '良性' | '恶性' | '待定';
}

// Union type for all assets
export type Asset = LiquidAsset | FixedAsset | FinancialAsset | ProtectionAsset | LiabilityAsset;

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
export type ExportFormat = 'json' | 'csv';

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