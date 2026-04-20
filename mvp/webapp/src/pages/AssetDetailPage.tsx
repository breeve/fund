import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAssetStore } from '@/store';
import { CATEGORY_NAMES, CATEGORY_COLORS, isPublicFund, isPrivateFund, isStrategy, isFixedTerm, isLiquid, isDerivative, isProtection } from '@/types';
import { format } from 'date-fns';

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assets, getAssetAdjustments } = useAssetStore();

  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">资产不存在</h1>
        </div>
        <div className="card">
          <p>该资产可能已被删除。</p>
          <Link to="/assets" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            返回资产列表
          </Link>
        </div>
      </div>
    );
  }

  const adjustments = getAssetAdjustments(asset.id);

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`;
    }
    return `${amount.toLocaleString('zh-CN')}元`;
  };

  const getCategoryEmoji = () => {
    switch (asset.category) {
      case 'fund': return '📈';
      case 'private_fund': return '📊';
      case 'strategy': return '🎯';
      case 'fixed': return '🏦';
      case 'liquid': return '💵';
      case 'derivative': return '🥇';
      case 'protection': return '🛡️';
      default: return '📋';
    }
  };

  const getDisplayAmount = () => {
    if ('total' in asset) return asset.total;
    if ('investmentAmount' in asset) return asset.investmentAmount;
    return 0;
  };

  // Render category-specific details
  const renderCategoryDetails = () => {
    // Public Fund (公募基金)
    if (isPublicFund(asset)) {
      return (
        <>
          {asset.code && (
            <div className="detail-row">
              <span className="detail-label">基金编码</span>
              <span className="detail-value" style={{ fontFamily: 'var(--font-mono)' }}>{asset.code}</span>
            </div>
          )}
          {asset.sharpeRatio !== undefined && (
            <div className="detail-row">
              <span className="detail-label">夏普比率</span>
              <span className="detail-value">{asset.sharpeRatio}</span>
            </div>
          )}
          {asset.topHoldings && asset.topHoldings.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">重仓股票</span>
              <span className="detail-value">{asset.topHoldings.join(', ')}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">总额度</span>
            <span className="detail-value">{formatAmount(asset.total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持仓成本</span>
            <span className="detail-value">{formatAmount(asset.cost)}</span>
            <span className="detail-hint">(总额度 - 持有收益)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益</span>
            <span className="detail-value" style={{ color: asset.profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.profit >= 0 ? '+' : ''}{formatAmount(asset.profit)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益率</span>
            <span className="detail-value" style={{ color: asset.returnRate >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.returnRate >= 0 ? '+' : ''}{asset.returnRate.toFixed(2)}%
            </span>
          </div>
        </>
      );
    }

    // Private Fund (私募基金)
    if (isPrivateFund(asset)) {
      return (
        <>
          {asset.code && (
            <div className="detail-row">
              <span className="detail-label">基金编码</span>
              <span className="detail-value" style={{ fontFamily: 'var(--font-mono)' }}>{asset.code}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">总额度</span>
            <span className="detail-value">{formatAmount(asset.total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持仓成本</span>
            <span className="detail-value">{formatAmount(asset.cost)}</span>
            <span className="detail-hint">(总额度 - 持有收益)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益</span>
            <span className="detail-value" style={{ color: asset.profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.profit >= 0 ? '+' : ''}{formatAmount(asset.profit)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益率</span>
            <span className="detail-value" style={{ color: asset.returnRate >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.returnRate >= 0 ? '+' : ''}{asset.returnRate.toFixed(2)}%
            </span>
          </div>
        </>
      );
    }

    // Strategy (策略)
    if (isStrategy(asset)) {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">总额度</span>
            <span className="detail-value">{formatAmount(asset.total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持仓成本</span>
            <span className="detail-value">{formatAmount(asset.cost)}</span>
            <span className="detail-hint">(总额度 - 持有收益)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益</span>
            <span className="detail-value" style={{ color: asset.profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.profit >= 0 ? '+' : ''}{formatAmount(asset.profit)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益率</span>
            <span className="detail-value" style={{ color: asset.returnRate >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.returnRate >= 0 ? '+' : ''}{asset.returnRate.toFixed(2)}%
            </span>
          </div>
        </>
      );
    }

    // Fixed Term (定期)
    if (isFixedTerm(asset)) {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">年限</span>
            <span className="detail-value">{asset.duration}年</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">起投日期</span>
            <span className="detail-value">{asset.startDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">年化收益率</span>
            <span className="detail-value">{asset.annualReturn}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">投资金额</span>
            <span className="detail-value">{formatAmount(asset.investmentAmount)}</span>
          </div>
        </>
      );
    }

    // Liquid (活钱)
    if (isLiquid(asset)) {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">总额度</span>
            <span className="detail-value">{formatAmount(asset.total)}</span>
          </div>
        </>
      );
    }

    // Derivative (金融衍生品)
    if (isDerivative(asset)) {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">资产来源</span>
            <span className="detail-value">{asset.source}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">总额度</span>
            <span className="detail-value">{formatAmount(asset.total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持仓成本</span>
            <span className="detail-value">{formatAmount(asset.cost)}</span>
            <span className="detail-hint">(总额度 - 持有收益)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益</span>
            <span className="detail-value" style={{ color: asset.profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.profit >= 0 ? '+' : ''}{formatAmount(asset.profit)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">持有收益率</span>
            <span className="detail-value" style={{ color: asset.returnRate >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.returnRate >= 0 ? '+' : ''}{asset.returnRate.toFixed(2)}%
            </span>
          </div>
        </>
      );
    }

    // Protection (保障)
    if (isProtection(asset)) {
      return (
        <div className="detail-row">
          <span className="detail-label">类型</span>
          <span className="detail-value">{asset.subType}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/assets')}>
          ← 返回列表
        </button>
      </div>

      {/* Header */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius)',
              backgroundColor: `${CATEGORY_COLORS[asset.category]}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}>
              {getCategoryEmoji()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                {asset.name}
              </h1>
              <div style={{ color: 'var(--color-text-secondary)' }}>
                {CATEGORY_NAMES[asset.category]} · {asset.subType}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text)',
          }}>
            {formatAmount(getDisplayAmount())}
          </div>
        </div>

        {asset.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
            {asset.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">详细信息</h2>
        </div>
        <div className="detail-list">
          {renderCategoryDetails()}
        </div>
      </div>

      {/* Notes */}
      {asset.notes && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="card-title">备注</h2>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{asset.notes}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <span>录入时间: {format(new Date(asset.entryTime), 'yyyy-MM-dd')}</span>
          <span>创建于 {format(new Date(asset.createdAt), 'yyyy-MM-dd HH:mm')}</span>
          <span>更新于 {format(new Date(asset.updatedAt), 'yyyy-MM-dd HH:mm')}</span>
        </div>
      </div>

      {/* Adjustment History */}
      {adjustments.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="card-title">调整历史</h2>
          </div>
          <div className="detail-list">
            {adjustments.map((adj) => (
              <div key={adj.id} className="detail-row">
                <span className="detail-label">{format(new Date(adj.adjustedAt), 'yyyy-MM-dd')}</span>
                <span className="detail-value">
                  {formatAmount(adj.previousValue)} → {formatAmount(adj.newValue)}
                  {adj.changeReason && <span style={{ color: 'var(--color-text-muted)' }}> ({adj.changeReason})</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Link to={`/assets/${asset.id}/edit`} className="btn btn-primary">
          编辑资产
        </Link>
        <Link to="/assets" className="btn btn-secondary">
          返回列表
        </Link>
      </div>
    </div>
  );
}
