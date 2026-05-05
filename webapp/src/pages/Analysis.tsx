import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { Alert, AlertIndicator } from '@/components/ui/Alert';
import { PieChart } from '@/components/charts/PieChart';

const MOCK_ASSET_TREND = [
  { month: '2024-01', total: 2800000 },
  { month: '2024-02', total: 2850000 },
  { month: '2024-03', total: 2900000 },
  { month: '2024-04', total: 2880000 },
  { month: '2024-05', total: 2950000 },
  { month: '2024-06', total: 3100000 },
  { month: '2024-07', total: 3150000 },
  { month: '2024-08', total: 3200000 },
  { month: '2024-09', total: 3180000 },
  { month: '2024-10', total: 3250000 },
  { month: '2024-11', total: 3300000 },
  { month: '2024-12', total: 3420000 },
];

const MOCK_CATEGORY_BREAKDOWN = [
  { name: '流动资产', value: 820000 },
  { name: '固定资产', value: 1500000 },
  { name: '金融投资', value: 600000 },
  { name: '保障资产', value: 200000 },
  { name: '负债', value: -500000 },
];

const MOCK_FUND_ALLOCATION = [
  { name: '股票型', value: 35 },
  { name: '混合型', value: 25 },
  { name: '债券型', value: 20 },
  { name: '指数型', value: 15 },
  { name: '货币型', value: 5 },
];

export default function Analysis() {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('1y');

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>资产分析</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {(['6m', '1y', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: 'var(--spacing-1) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: timeRange === range ? 'var(--color-primary-600)' : 'var(--color-gray-100)',
                color: timeRange === range ? 'white' : 'var(--color-gray-700)',
                transition: 'all var(--duration-fast)',
              }}
            >
              {range === '6m' ? '近6月' : range === '1y' ? '近1年' : '全部'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>总资产</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
                ¥3,420,000
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>+15.7%</div>
            </div>
            <AlertIndicator severity="normal" label="正常" />
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>净资产</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                ¥2,920,000
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>+18.2%</div>
            </div>
            <AlertIndicator severity="normal" label="正常" />
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>基金组合收益</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
                +12.8%
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>跑赢基准 5.3%</div>
            </div>
            <AlertIndicator severity="attention" label="关注" />
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>综合评级</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                A
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>稳健型</div>
            </div>
            <AlertIndicator severity="normal" label="正常" />
          </div>
        </Card>
      </div>

      <Alert severity="attention" title="资产配置提醒">
        风险资产占比 45%，接近建议区间上限。建议适当增加流动资产配置以提升抗风险能力。
      </Alert>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="资产趋势">
          <div style={{ height: '300px' }}>
            <LineChart
              xData={MOCK_ASSET_TREND.map((t) => t.month)}
              yData={MOCK_ASSET_TREND.map((t) => t.total)}
            />
          </div>
        </Card>
        <Card title="资产构成">
          <div style={{ height: '300px' }}>
            <BarChart
              xData={MOCK_CATEGORY_BREAKDOWN.map((c) => c.name)}
              yData={MOCK_CATEGORY_BREAKDOWN.map((c) => c.value)}
            />
          </div>
        </Card>
      </div>

      <Card title="基金配置分布">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }}>
          <div style={{ height: '200px' }}>
            <PieChart
              data={MOCK_FUND_ALLOCATION.map((item) => ({
                name: item.name,
                value: item.value,
              }))}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--spacing-2)' }}>
            {MOCK_FUND_ALLOCATION.map((item) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-gray-700)' }}>{item.name}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary-600)' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Alert severity="warning" title="偿债能力预警">
        月供收入比 42%，超过 40% 预警线。建议关注现金流管理，避免流动性风险。
      </Alert>
    </div>
  );
}