import { useAssetStore } from '@/store';
import { MetricCard } from '@/components/MetricCard';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { NetWorthTrendChart } from '@/components/NetWorthTrendChart';
import { Link } from 'react-router-dom';
import { CATEGORY_NAMES, CATEGORY_COLORS, type AssetCategory } from '@/types';
import { format } from 'date-fns';

export function OverviewPage() {
  const { getTotalAssets, getTotalLiabilities, getNetAssets, getCategoryBreakdown, assets } =
    useAssetStore();

  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const netAssets = getNetAssets();
  const breakdown = getCategoryBreakdown();

  // Calculate change (mock)
  const changeRate = 2.35;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">资产总览</h1>
        <p className="page-description">查看您的家庭资产整体状况</p>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <MetricCard
          title="净资产"
          value={`${(netAssets / 10000).toFixed(2)}万`}
          subValue={format(new Date(), 'yyyy年MM月dd日')}
          change={changeRate}
          icon="💎"
          color="primary"
        />
        <MetricCard
          title="总资产"
          value={`${(totalAssets / 10000).toFixed(2)}万`}
          icon="🏦"
          color="success"
        />
        <MetricCard
          title="总负债"
          value={`${(totalLiabilities / 10000).toFixed(2)}万`}
          icon="📋"
          color="danger"
        />
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
      }}>
        <div className="card">
          <CategoryPieChart data={breakdown} title="资产构成" />
        </div>
        <div className="card">
          <NetWorthTrendChart
            data={undefined}
            dateRange="3M"
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">资产分类明细</h2>
          <Link to="/assets" className="btn btn-secondary btn-sm">
            查看全部
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>类别</th>
              <th>金额</th>
              <th>占比</th>
              <th>资产数</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(CATEGORY_NAMES) as AssetCategory[])
              .filter((cat) => cat !== 'liability' && breakdown[cat] > 0)
              .map((category) => {
                const count = assets.filter((a) => a.category === category).length;
                const amount = breakdown[category];
                const percentage = totalAssets > 0 ? (amount / totalAssets) * 100 : 0;

                return (
                  <tr key={category}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: CATEGORY_COLORS[category],
                        }} />
                        {CATEGORY_NAMES[category]}
                      </div>
                    </td>
                    <td>{(amount / 10000).toFixed(2)}万</td>
                    <td>{percentage.toFixed(1)}%</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        <Link to="/assets/new" className="card" style={{
          textDecoration: 'none',
          textAlign: 'center',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-fast)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>➕</div>
          <div style={{ fontWeight: 600 }}>添加资产</div>
        </Link>
        <Link to="/fund" className="card" style={{
          textDecoration: 'none',
          textAlign: 'center',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-fast)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🔍</div>
          <div style={{ fontWeight: 600 }}>基金诊断</div>
        </Link>
        <Link to="/settings" className="card" style={{
          textDecoration: 'none',
          textAlign: 'center',
          padding: 'var(--space-6)',
          transition: 'all var(--transition-fast)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>⚙️</div>
          <div style={{ fontWeight: 600 }}>设置</div>
        </Link>
      </div>
    </div>
  );
}