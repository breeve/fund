import { Card } from '@/components/ui/Card';
import { PyramidChart } from '@/components/charts/PyramidChart';
import { CATEGORY_LABELS, type AssetCategory } from '@/types/asset';

interface AssetSummaryProps {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  categoryBreakdown: Record<AssetCategory, number>;
  periodChange?: number;
}

const PYRAMID_DATA = [
  { name: '高度流动', value: 30 },
  { name: '中度流动', value: 25 },
  { name: '低度流动', value: 20 },
  { name: '长期锁定', value: 15 },
  { name: '固定资产', value: 10 },
];

export function AssetSummary({
  totalAssets,
  totalLiabilities,
  netAssets,
  categoryBreakdown,
  periodChange = 0,
}: AssetSummaryProps) {
  const changeLabel = periodChange >= 0 ? `+${periodChange.toFixed(1)}%` : `${periodChange.toFixed(1)}%`;
  const changeColor = periodChange >= 0 ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>总资产</div>
          <div
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary-600)',
            }}
          >
            ¥{totalAssets.toLocaleString()}
          </div>
          {periodChange !== 0 && (
            <div style={{ fontSize: 'var(--font-size-sm)', color: changeColor }}>{changeLabel}</div>
          )}
        </Card>

        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>总负债</div>
          <div
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-danger)',
            }}
          >
            ¥{totalLiabilities.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>负债率 {((totalLiabilities / totalAssets) * 100).toFixed(1)}%</div>
        </Card>

        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>净资产</div>
          <div
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-success)',
            }}
          >
            ¥{netAssets.toLocaleString()}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="资产构成">
          <div style={{ height: '300px' }}>
            <PyramidChart data={PYRAMID_DATA} />
          </div>
        </Card>

        <Card title="分类明细">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {Object.entries(categoryBreakdown).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ color: 'var(--color-gray-700)' }}>
                  {CATEGORY_LABELS[key as AssetCategory]}
                </span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  ¥{value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
