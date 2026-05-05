import { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { useFundStore } from '@/store/fundStore';
import { FUND_TYPE_LABELS } from '@/types/fund';

interface FundDetailProps {
  code: string;
}

export function FundDetail({ code }: FundDetailProps) {
  const { currentFund, navHistory, loading, fetchFund } = useFundStore();

  useEffect(() => {
    fetchFund(code);
  }, [code, fetchFund]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>加载中...</div>;
  }

  if (!currentFund) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-gray-500)' }}>未找到基金信息</div>;
  }

  const chartData = navHistory.map((item) => ({
    date: item.date,
    value: item.nav,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Card title="基金概况">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>基金名称</div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{currentFund.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>基金代码</div>
            <div style={{ fontSize: 'var(--font-size-lg)' }}>{currentFund.code}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>基金类型</div>
            <div style={{ fontSize: 'var(--font-size-lg)' }}>{FUND_TYPE_LABELS[currentFund.type] || currentFund.type}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>基金经理</div>
            <div style={{ fontSize: 'var(--font-size-lg)' }}>{currentFund.manager}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>当前净值</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
              {currentFund.nav.toFixed(4)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>更新日期</div>
            <div style={{ fontSize: 'var(--font-size-lg)' }}>{currentFund.navDate}</div>
          </div>
        </div>
      </Card>

      <Card title="历史净值">
        {chartData.length > 0 ? (
          <div style={{ height: '300px' }}>
            <LineChart xData={chartData.map((d) => d.date)} yData={chartData.map((d) => d.value)} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-gray-500)' }}>暂无净值数据</div>
        )}
      </Card>
    </div>
  );
}