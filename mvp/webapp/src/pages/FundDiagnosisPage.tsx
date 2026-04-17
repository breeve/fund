import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFundStore } from '@/store';
import { LoadingState, ErrorState } from '@/components/LoadingState';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export function FundDiagnosisPage() {
  const { code } = useParams<{ code: string }>();
  const { selectedFund, selectFund, isLoading, error, clearError } = useFundStore();

  useEffect(() => {
    if (code) {
      selectFund(code);
    }
    return () => clearError();
  }, [code, selectFund, clearError]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <LoadingState message="正在获取基金数据..." />
      </div>
    );
  }

  if (error || !selectedFund) {
    return (
      <div className="animate-fade-in">
        <ErrorState
          message={error ?? '无法加载基金数据'}
          onRetry={() => code && selectFund(code)}
        />
      </div>
    );
  }

  const { fundInfo, navHistory, topHoldings, industryDistribution, riskMetrics, rating, recommendation } = selectedFund;

  // NAV history chart
  const navChartOption: EChartsOption = {
    title: {
      text: '净值走势',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: unknown) => {
        const pArr = params as Array<{ axisValue: string; value: number }>;
        if (!pArr?.[0]) return '';
        return `${pArr[0].axisValue}<br/>净值: ${pArr[0].value?.toFixed(4) ?? ''}`;
      },
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: navHistory.slice(-90).map((n) => n.date),
      boundaryGap: false,
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        data: navHistory.slice(-90).map((n) => n.nav),
        smooth: true,
        lineStyle: { width: 2, color: '#2563eb' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.2)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.02)' },
            ],
          },
        },
      },
    ],
  };

  // Industry distribution chart
  const industryData = industryDistribution
    ? Object.entries(industryDistribution).map(([name, value]) => ({ name, value }))
    : [];
  const industryChartOption: EChartsOption = {
    title: {
      text: '行业分布',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: industryData,
        label: { formatter: '{b}\n{d}%' },
      },
    ],
  };

  // Render star rating
  const renderStars = (r: number) => {
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link to="/fund" className="btn btn-ghost btn-sm">
          ← 返回搜索
        </Link>
      </div>

      {/* Fund Info */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              {fundInfo.name}
            </h1>
            <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              <span>代码: {fundInfo.code}</span>
              <span>类型: {fundInfo.type}</span>
              <span>公司: {fundInfo.company}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2.5rem',
              color: rating >= 4 ? 'var(--color-success)' : rating >= 3 ? 'var(--color-warning)' : 'var(--color-danger)',
            }}>
              {renderStars(rating)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              风险评级
            </div>
          </div>
        </div>
        {fundInfo.manager && (
          <div style={{ marginTop: 'var(--space-3)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            基金经理: {fundInfo.manager}
          </div>
        )}
        {recommendation && (
          <div style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: rating >= 4 ? '#dcfce7' : '#fef3c7',
            borderRadius: 'var(--radius)',
            color: rating >= 4 ? '#166534' : '#92400e',
            display: 'inline-block',
          }}>
            {recommendation}
          </div>
        )}
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
      }}>
        <div className="card">
          <ReactECharts option={navChartOption} style={{ height: 250 }} opts={{ renderer: 'svg' }} />
        </div>
        <div className="card">
          <ReactECharts option={industryChartOption} style={{ height: 250 }} opts={{ renderer: 'svg' }} />
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">风险指标</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>波动率</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {riskMetrics.volatility.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>最大回撤</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-danger)' }}>
              {riskMetrics.maxDrawdown.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>夏普比率</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: riskMetrics.sharpeRatio > 1 ? 'var(--color-success)' : 'var(--color-text)' }}>
              {riskMetrics.sharpeRatio.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>与大盘相关性</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {riskMetrics.correlationToMarket.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">前十大持仓</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>排名</th>
              <th>股票名称</th>
              <th>代码</th>
              <th>持仓占比</th>
              <th>行业</th>
            </tr>
          </thead>
          <tbody>
            {topHoldings.map((holding) => (
              <tr key={holding.rank}>
                <td>{holding.rank}</td>
                <td style={{ fontWeight: 500 }}>{holding.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                  {holding.code ?? '-'}
                </td>
                <td style={{
                  color: holding.proportion > 10 ? 'var(--color-warning)' : 'var(--color-text)',
                  fontWeight: holding.proportion > 10 ? 600 : 400,
                }}>
                  {holding.proportion.toFixed(2)}%
                </td>
                <td>
                  <span className="badge badge-info">{holding.industry ?? '-'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}