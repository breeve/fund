import { Card } from '@/components/ui/Card';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';

const MOCK_ASSETS = {
  total: 3420000,
  liabilities: 500000,
  netAssets: 2920000,
};

const MOCK_ASSET_ALLOCATION = [
  { name: '流动资产', value: 820000 },
  { name: '固定资产', value: 1500000 },
  { name: '金融投资', value: 600000 },
  { name: '保障资产', value: 200000 },
];

const MOCK_FUND_PERFORMANCE = [
  { month: '2024-07', value: 100 },
  { month: '2024-08', value: 102.5 },
  { month: '2024-09', value: 101.8 },
  { month: '2024-10', value: 105.2 },
  { month: '2024-11', value: 107.8 },
  { month: '2024-12', value: 112.8 },
];

const MOCK_PROPERTY_TREND = [
  { month: '2024-07', price: 55000 },
  { month: '2024-08', price: 55200 },
  { month: '2024-09', price: 54800 },
  { month: '2024-10', price: 56100 },
  { month: '2024-11', price: 56800 },
  { month: '2024-12', price: 57500 },
];

export default function Dashboard() {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>家庭资产总览</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>总资产</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
            ¥{MOCK_ASSETS.total.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>总负债</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
            ¥{MOCK_ASSETS.liabilities.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>净资产</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
            ¥{MOCK_ASSETS.netAssets.toLocaleString()}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="资产构成">
          <div style={{ height: '250px' }}>
            <PieChart
              data={MOCK_ASSET_ALLOCATION.map((item) => ({
                name: item.name,
                value: item.value,
              }))}
            />
          </div>
        </Card>
        <Card title="基金组合表现">
          <div style={{ height: '250px' }}>
            <LineChart
              xData={MOCK_FUND_PERFORMANCE.map((d) => d.month)}
              yData={MOCK_FUND_PERFORMANCE.map((d) => d.value)}
            />
          </div>
        </Card>
      </div>

      <Card title="房产趋势">
        <div style={{ height: '250px' }}>
          <BarChart
            xData={MOCK_PROPERTY_TREND.map((d) => d.month)}
            yData={MOCK_PROPERTY_TREND.map((d) => d.price)}
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
        <Card title="基金配置">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {[
              { name: '景顺长城新兴成长混合', code: '260108', return: 15.8, ratio: 35 },
              { name: '易方达消费行业股票', code: '110022', return: 12.3, ratio: 25 },
              { name: '富国天惠成长混合', code: '161005', return: 10.5, ratio: 20 },
              { name: '招商中证白酒指数', code: '161725', return: 8.7, ratio: 20 },
            ].map((fund) => (
              <div
                key={fund.code}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{fund.name}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{fund.code}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)' }}>+{fund.return}%</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{fund.ratio}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="房产概览">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)' }}>
            {[
              { label: '福田区', count: 2, avgPrice: 82000 },
              { label: '南山区', count: 1, avgPrice: 95000 },
              { label: '龙岗区', count: 1, avgPrice: 48000 },
              { label: '宝安区', count: 1, avgPrice: 55000 },
            ].map((district) => (
              <div
                key={district.label}
                style={{
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{district.label}</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{district.count} 套</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-600)' }}>均价 ¥{district.avgPrice.toLocaleString()}/㎡</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}