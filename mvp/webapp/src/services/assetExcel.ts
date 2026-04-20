import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Asset, AssetCategory } from '@/types';
import { SOURCE_TAGS } from '@/types';

// =============================================================================
// 版本化配置格式
// =============================================================================

/** Excel 配置版本号，每次格式变更都需要递增 */
export const EXCEL_CONFIG_VERSION = 1;

/** 固定的工作表名称 */
export const SHEET_NAME_ASSETS = '资产';
export const SHEET_NAME_CONFIG = '配置';

/** 导出文件名前缀 */
export const EXCEL_FILE_PREFIX = 'fund-assets';

/**
 * Excel 配置元数据
 * 每个 Excel 文件包含一个配置表，记录格式版本等信息
 * 导入时读取此信息以兼容不同版本
 */
export interface ExcelConfig {
  version: number;              // 配置版本号
  exportedAt: string;           // 导出时间
  appVersion: string;           // 应用版本
  totalCount: number;           // 资产数量
}

/** Excel 导出包结构 */
export interface AssetExcelPackage {
  config: ExcelConfig;
  assets: Asset[];
}

// =============================================================================
// 列定义（版本化）
// =============================================================================

/**
 * V1 列定义
 * 变更历史：
 * - V1 (2026-04): 初始版本
 */
interface ColumnDef {
  key: string;
  header: string;
  /** 宽度（字符） */
  width?: number;
  /** 数值精度，undefined 表示字符串 */
  precision?: number;
}

export const EXCEL_COLUMNS_V1: ColumnDef[] = [
  { key: 'name',           header: '名称',           width: 20 },
  { key: 'category',       header: '类别',           width: 10 },
  { key: 'subType',        header: '子类别',         width: 16 },
  { key: 'total',          header: '总额度(元)',      width: 14, precision: 2 },
  { key: 'cost',           header: '持有成本(元)',    width: 14, precision: 2 },
  { key: 'profit',         header: '持有收益(元)',    width: 14, precision: 2 },
  { key: 'returnRate',     header: '收益率(%)',      width: 10, precision: 2 },
  { key: 'annualReturn',   header: '年化收益率(%)',  width: 12, precision: 2 },
  { key: 'duration',       header: '期限(年)',       width: 10 },
  { key: 'startDate',      header: '起投日期',       width: 12 },
  { key: 'investmentAmount', header: '投资金额(元)', width: 14, precision: 2 },
  { key: 'code',           header: '基金编码',       width: 12 },
  { key: 'sharpeRatio',    header: '夏普比率',       width: 10, precision: 4 },
  { key: 'topHoldings',    header: '重仓股票',       width: 24 },
  { key: 'source',         header: '资产来源',       width: 12 },
  { key: 'tags',           header: '标签',           width: 20 },
  { key: 'notes',          header: '备注',           width: 30 },
  { key: 'entryTime',      header: '录入时间',       width: 12 },
];

// 按版本获取列定义
function getColumns(version: number): ColumnDef[] {
  if (version === 1) return EXCEL_COLUMNS_V1;
  // 未来版本 fallback 到最新
  return EXCEL_COLUMNS_V1;
}

// =============================================================================
// 辅助函数
// =============================================================================

/** 从资产对象提取单元格值 */
function assetToRow(asset: Asset): Record<string, unknown> {
  const base: Record<string, unknown> = {
    name: asset.name,
    category: asset.category,
    subType: asset.subType,
    tags: asset.tags.join(';'),
    notes: asset.notes,
    entryTime: asset.entryTime.split('T')[0],
  };

  // 数值类资产（非活钱）
  if ('total' in asset) {
    base.total = asset.total;
    if ('cost' in asset) {
      base.cost = asset.cost;
      base.profit = asset.profit;
      base.returnRate = asset.returnRate;
    }
  }

  // 定期资产
  if ('investmentAmount' in asset) {
    base.investmentAmount = asset.investmentAmount;
    base.annualReturn = asset.annualReturn;
    base.duration = asset.duration;
    base.startDate = asset.startDate;
  }

  // 公募基金
  if ('code' in asset && asset.code) {
    base.code = asset.code;
  }
  if ('sharpeRatio' in asset && asset.sharpeRatio !== undefined) {
    base.sharpeRatio = asset.sharpeRatio;
  }
  if ('topHoldings' in asset && asset.topHoldings) {
    base.topHoldings = asset.topHoldings.join(';');
  }

  // 来源
  if ('source' in asset) {
    base.source = asset.source;
  }

  return base;
}

/** 将行数据转换为 Asset 对象 */
function rowToAsset(row: Record<string, string | number | boolean | null>, _version: number): Partial<Asset> | null {
  const name = String(row['名称'] ?? '');
  const categoryStr = String(row['类别'] ?? '');
  const category = categoryStr as AssetCategory;

  // 基础字段
  const asset: Partial<Asset> = {
    name,
    category,
    subType: String(row['子类别'] ?? ''),
    tags: String(row['标签'] ?? '').split(';').filter(Boolean),
    notes: String(row['备注'] ?? ''),
    entryTime: String(row['录入时间'] ?? new Date().toISOString().split('T')[0]),
  };

  const toNum = (v: string | number | boolean | null): number => {
    if (v === null || v === '' || v === undefined) return 0;
    return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
  };

  // 数值类资产
  if (category === 'fund' || category === 'private_fund' || category === 'strategy' || category === 'derivative') {
    (asset as Record<string, unknown>).total = toNum(row['总额度(元)'] ?? '');
    (asset as Record<string, unknown>).cost = toNum(row['持有成本(元)'] ?? '');
    (asset as Record<string, unknown>).profit = toNum(row['持有收益(元)'] ?? '');
    (asset as Record<string, unknown>).returnRate = toNum(row['收益率(%)'] ?? '');
  }

  // 定期资产
  if (category === 'fixed') {
    (asset as Record<string, unknown>).investmentAmount = toNum(row['投资金额(元)'] ?? '');
    (asset as Record<string, unknown>).annualReturn = toNum(row['年化收益率(%)'] ?? '');
    (asset as Record<string, unknown>).duration = toNum(row['期限(年)'] ?? '');
    (asset as Record<string, unknown>).startDate = String(row['起投日期'] ?? '');
  }

  // 公募基金特有
  if (category === 'fund') {
    const code = String(row['基金编码'] ?? '');
    if (code) (asset as Record<string, unknown>).code = code;

    const sr = row['夏普比率'];
    if (sr !== null && sr !== '' && sr !== undefined) {
      (asset as Record<string, unknown>).sharpeRatio = toNum(sr);
    }

    const th = String(row['重仓股票'] ?? '');
    if (th) (asset as Record<string, unknown>).topHoldings = th.split(';').filter(Boolean);
  }

  // 来源字段
  const source = String(row['资产来源'] ?? '');
  if (source && SOURCE_TAGS.includes(source as typeof SOURCE_TAGS[number])) {
    (asset as Record<string, unknown>).source = source;
  }

  return asset;
}

// =============================================================================
// 导出
// =============================================================================

/** 导出资产为 Excel 文件 */
export function exportAssetsToExcel(assets: Asset[], appVersion = '0.1.0'): void {
  const columns = getColumns(EXCEL_CONFIG_VERSION);

  // ---------- 工作表1：资产数据 ----------
  const dataRows = assets.map((asset) => {
    const row = assetToRow(asset);
    return columns.map((col) => {
      const val = row[col.key];
      if (val === undefined || val === null) return null;
      return val;
    });
  });

  const wsData = [
    columns.map((c) => c.header),
    ...dataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 设置列宽
  ws['!cols'] = columns.map((c) => ({ wch: c.width ?? 15 }));

  // ---------- 工作表2：配置信息 ----------
  const configData: ExcelConfig = {
    version: EXCEL_CONFIG_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion,
    totalCount: assets.length,
  };

  const configRows = [
    ['配置版本', String(configData.version)],
    ['导出时间', configData.exportedAt],
    ['应用版本', configData.appVersion],
    ['资产数量', String(configData.totalCount)],
  ];

  const wsConfig = XLSX.utils.aoa_to_sheet(configRows);
  wsConfig['!cols'] = [{ wch: 15 }, { wch: 30 }];

  // ---------- 打包 ----------
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME_ASSETS);
  XLSX.utils.book_append_sheet(wb, wsConfig, SHEET_NAME_CONFIG);

  const fileName = `${EXCEL_FILE_PREFIX}-${new Date().toISOString().split('T')[0]}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
}

// =============================================================================
// 导入
// =============================================================================

export interface ImportResult {
  success: boolean;
  assets: Asset[];
  config?: ExcelConfig;
  errors: string[];
  version: number;
}

/** 导入 Excel 文件，返回解析结果 */
export function importAssetsFromExcel(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });

        // ---------- 读取配置表（可选，支持无配置表的老文件） ----------
        let config: ExcelConfig | undefined;
        const configSheet = wb.Sheets[SHEET_NAME_CONFIG];
        if (configSheet) {
          const configRaw = XLSX.utils.sheet_to_json<string[]>(configSheet, { header: 1 });
          const configMap: Record<string, string> = {};
          for (const [k, v] of configRaw) {
            if (k) configMap[k.trim()] = v?.trim() ?? '';
          }
          config = {
            version: parseInt(configMap['配置版本'] ?? '1', 10),
            exportedAt: configMap['导出时间'] ?? '',
            appVersion: configMap['应用版本'] ?? '',
            totalCount: parseInt(configMap['资产数量'] ?? '0', 10),
          };
        }

        const version = config?.version ?? 1;

        // ---------- 读取资产数据 ----------
        const assetsSheet = wb.Sheets[SHEET_NAME_ASSETS];
        if (!assetsSheet) {
          resolve({
            success: false,
            assets: [],
            config,
            errors: ['未找到资产工作表'],
            version,
          });
          return;
        }

        const rawRows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(assetsSheet, { header: 1 }) as (
          | string[]
          | Record<string, string | number | null>
        )[];

        if (rawRows.length < 2) {
          resolve({
            success: false,
            assets: [],
            config,
            errors: ['资产工作表无数据'],
            version,
          });
          return;
        }

        // 第一行为表头
        const headers = (rawRows[0] as string[]).map((h) => String(h ?? '').trim());
        const dataRows = rawRows.slice(1) as string[][];

        const errors: string[] = [];
        const assets: Asset[] = [];

        for (let i = 0; i < dataRows.length; i++) {
          const rowData: Record<string, string | number | null> = {};
          for (let j = 0; j < headers.length; j++) {
            if (headers[j]) {
              const hdr = headers[j]!;
              rowData[hdr] = dataRows[i]?.[j] ?? null;
            }
          }

          const partial = rowToAsset(rowData, version);

          if (!partial || !partial.name || !partial.category) {
            errors.push(`第 ${i + 2} 行：缺少名称或类别，跳过`);
            continue;
          }

          // 转换为完整 Asset（由调用方通过 addAsset 补全 id 等字段）
          assets.push(partial as unknown as Asset);
        }

        resolve({
          success: true,
          assets,
          config,
          errors,
          version,
        });
      } catch (err) {
        resolve({
          success: false,
          assets: [],
          errors: [`解析 Excel 失败：${err instanceof Error ? err.message : String(err)}`],
          version: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        assets: [],
        errors: ['读取文件失败'],
        version: 0,
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

// =============================================================================
// 兼容性工具
// =============================================================================

/**
 * 根据版本号获取迁移说明
 */
export function getMigrationNote(targetVersion: number): string {
  const notes: Record<number, string> = {
    1: 'V1 初始版本',
  };

  if (targetVersion === EXCEL_CONFIG_VERSION) {
    return '当前为最新版本，无需迁移';
  }

  const parts: string[] = [];
  for (let v = targetVersion + 1; v <= EXCEL_CONFIG_VERSION; v++) {
    if (notes[v]) parts.push(notes[v]!);
  }
  return parts.join('；');
}