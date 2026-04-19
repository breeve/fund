import { useState } from 'react';
import { useAssetStore } from '@/store';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORY_NAMES, CATEGORY_COLORS, type AssetCategory } from '@/types';
import { format } from 'date-fns';

export function AssetsPage() {
  const navigate = useNavigate();
  const { assets, deleteAsset } = useAssetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredAssets = assets
    .filter((asset) => {
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !asset.name.toLowerCase().includes(search) &&
          !asset.tags.some((t) => t.toLowerCase().includes(search))
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = 'total' in a ? a.total : 'investmentAmount' in a ? a.investmentAmount : 0;
      const bValue = 'total' in b ? b.total : 'investmentAmount' in b ? b.investmentAmount : 0;
      return bValue - aValue;
    });

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setShowDeleteConfirm(null);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`;
    }
    return `${amount.toLocaleString('zh-CN')}元`;
  };

  const getAssetAmount = (asset: typeof assets[number]) => {
    if ('total' in asset) return asset.total;
    if ('investmentAmount' in asset) return asset.investmentAmount;
    return 0;
  };

  const getCategoryEmoji = (category: AssetCategory) => {
    switch (category) {
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

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">资产列表</h1>
            <p className="page-description">管理您的所有资产</p>
          </div>
          <Link to="/assets/new" className="btn btn-primary">
            ➕ 添加资产
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="搜索资产名称或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('all')}
            >
              全部
            </button>
            {(Object.keys(CATEGORY_NAMES) as AssetCategory[]).map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(category)}
                style={selectedCategory === category ? {} : {
                  borderColor: CATEGORY_COLORS[category],
                  color: CATEGORY_COLORS[category],
                }}
              >
                {CATEGORY_NAMES[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset List */}
      {filteredAssets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">暂无资产</div>
          <p>点击下方按钮添加您的第一笔资产</p>
          <Link to="/assets/new" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            添加资产
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onClick={() => navigate(`/assets/${asset.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius)',
                  backgroundColor: `${CATEGORY_COLORS[asset.category]}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {getCategoryEmoji(asset.category)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {CATEGORY_NAMES[asset.category]} · {asset.subType}
                    {asset.tags.length > 0 && (
                      <span> · {asset.tags.join(', ')}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    录入: {format(new Date(asset.entryTime), 'yyyy-MM-dd')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                  }}>
                    {formatAmount(getAssetAmount(asset))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    更新于 {format(new Date(asset.updatedAt), 'MM/dd')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    查看
                  </button>
                  <Link
                    to={`/assets/${asset.id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >
                    编辑
                  </Link>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowDeleteConfirm(asset.id)}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">确认删除</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>确定要删除这笔资产吗？此操作无法撤销。</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                取消
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
