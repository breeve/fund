import { useState } from 'react';
import { useFundStore } from '@/store';
import { Link } from 'react-router-dom';

export function FundPage() {
  const { searchResults, searchFunds, isLoading, error, clearError } = useFundStore();
  const [keyword, setKeyword] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    await searchFunds(keyword.trim());
  };

  const popularFunds = [
    { code: '000961', name: '天弘沪深300ETF联接A', type: '指数型' },
    { code: '110022', name: '易方达消费行业股票', type: '股票型' },
    { code: '161725', name: '招商中证白酒指数(LOF)', type: '指数型' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">基金诊断</h1>
        <p className="page-description">搜索基金，获取详细的诊断分析</p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="输入基金代码或名称搜索..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-3)',
            backgroundColor: '#fee2e2',
            borderRadius: 'var(--radius)',
            color: '#991b1b',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button className="btn btn-ghost btn-sm" onClick={clearError}>✕</button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">搜索结果</h2>
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {searchResults.map((fund) => (
              <Link
                key={fund.code}
                to={`/fund/${fund.code}`}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: 'none',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    {fund.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {fund.code} · {fund.type} · {fund.company}
                  </div>
                </div>
                <div style={{ color: 'var(--color-primary)' }}>查看诊断 →</div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Popular Funds */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="card-header">
              <h2 className="card-title">热门基金</h2>
            </div>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {popularFunds.map((fund) => (
                <Link
                  key={fund.code}
                  to={`/fund/${fund.code}`}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textDecoration: 'none',
                    padding: 'var(--space-4)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                      {fund.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {fund.code} · {fund.type}
                    </div>
                  </div>
                  <div style={{ color: 'var(--color-primary)' }}>查看诊断 →</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem' }}>💡</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>使用提示</div>
                <ul style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  paddingLeft: 'var(--space-4)',
                  margin: 0,
                }}>
                  <li>输入基金代码（如 000961）或基金名称进行搜索</li>
                  <li>点击基金卡片可查看完整的诊断分析报告</li>
                  <li>诊断包括：持仓穿透、风险评级、行业分布等</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}