import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAssetStore } from '@/store';
import { CATEGORY_NAMES, CATEGORY_COLORS } from '@/types';
import { format } from 'date-fns';

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assets } = useAssetStore();

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

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`;
    }
    return `${amount.toLocaleString('zh-CN')}元`;
  };

  // Render category-specific details
  const renderCategoryDetails = () => {
    switch (asset.category) {
      case 'liquid':
        return (
          <>
            {asset.institution && (
              <div className="detail-row">
                <span className="detail-label">开户机构</span>
                <span className="detail-value">{asset.institution}</span>
              </div>
            )}
            {asset.productName && (
              <div className="detail-row">
                <span className="detail-label">产品名称</span>
                <span className="detail-value">{asset.productName}</span>
              </div>
            )}
            {asset.annualYield !== undefined && (
              <div className="detail-row">
                <span className="detail-label">年化收益率</span>
                <span className="detail-value">{asset.annualYield}%</span>
              </div>
            )}
          </>
        );

      case 'fixed':
        return (
          <>
            <div className="detail-row">
              <span className="detail-label">购买日期</span>
              <span className="detail-value">{asset.purchaseDate || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">购买金额</span>
              <span className="detail-value">{formatAmount(asset.purchaseAmount || 0)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">当前估值</span>
              <span className="detail-value">{formatAmount(asset.currentValue || 0)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">持有目的</span>
              <span className="detail-value">{asset.holdingPurpose || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">当前状态</span>
              <span className="detail-value">{asset.status || '-'}</span>
            </div>
            {asset.monthlyRent !== undefined && (
              <div className="detail-row">
                <span className="detail-label">月租金</span>
                <span className="detail-value">{formatAmount(asset.monthlyRent)}</span>
              </div>
            )}
            {asset.loanAmount !== undefined && asset.loanAmount > 0 && (
              <>
                <div className="detail-row">
                  <span className="detail-label">贷款金额</span>
                  <span className="detail-value">{formatAmount(asset.loanAmount)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">贷款利率</span>
                  <span className="detail-value">{asset.loanRate || '-'}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">剩余期限</span>
                  <span className="detail-value">{asset.loanRemainingTerm || '-'}月</span>
                </div>
                {asset.monthlyPayment !== undefined && (
                  <div className="detail-row">
                    <span className="detail-label">月供</span>
                    <span className="detail-value">{formatAmount(asset.monthlyPayment)}</span>
                  </div>
                )}
              </>
            )}
            {asset.leaseEndDate && (
              <div className="detail-row">
                <span className="detail-label">租约到期日</span>
                <span className="detail-value">{asset.leaseEndDate}</span>
              </div>
            )}
            {asset.depreciationYears && (
              <div className="detail-row">
                <span className="detail-label">折旧年限</span>
                <span className="detail-value">{asset.depreciationYears}年</span>
              </div>
            )}
          </>
        );

      case 'financial':
        return (
          <>
            {asset.productCode && (
              <div className="detail-row">
                <span className="detail-label">产品代码</span>
                <span className="detail-value" style={{ fontFamily: 'var(--font-mono)' }}>{asset.productCode}</span>
              </div>
            )}
            {asset.quantity !== undefined && (
              <div className="detail-row">
                <span className="detail-label">持有数量</span>
                <span className="detail-value">{asset.quantity.toLocaleString()}</span>
              </div>
            )}
            {asset.costPrice !== undefined && (
              <div className="detail-row">
                <span className="detail-label">成本单价</span>
                <span className="detail-value">{asset.costPrice}</span>
              </div>
            )}
            {asset.currentPrice !== undefined && (
              <div className="detail-row">
                <span className="detail-label">当前单价</span>
                <span className="detail-value">{asset.currentPrice}</span>
              </div>
            )}
            {asset.costTotal !== undefined && (
              <div className="detail-row">
                <span className="detail-label">成本总额</span>
                <span className="detail-value">{formatAmount(asset.costTotal)}</span>
              </div>
            )}
            {asset.marketValue !== undefined && (
              <div className="detail-row">
                <span className="detail-label">当前市值</span>
                <span className="detail-value">{formatAmount(asset.marketValue)}</span>
              </div>
            )}
            {asset.purchaseDate && (
              <div className="detail-row">
                <span className="detail-label">买入日期</span>
                <span className="detail-value">{asset.purchaseDate}</span>
              </div>
            )}
            {asset.institution && (
              <div className="detail-row">
                <span className="detail-label">账户所在机构</span>
                <span className="detail-value">{asset.institution}</span>
              </div>
            )}
            {asset.fundCompany && (
              <div className="detail-row">
                <span className="detail-label">基金公司</span>
                <span className="detail-value">{asset.fundCompany}</span>
              </div>
            )}
            {asset.fundType && (
              <div className="detail-row">
                <span className="detail-label">基金类型</span>
                <span className="detail-value">{asset.fundType}</span>
              </div>
            )}
          </>
        );

      case 'protection':
        return (
          <>
            {asset.insuranceCompany && (
              <div className="detail-row">
                <span className="detail-label">保险公司</span>
                <span className="detail-value">{asset.insuranceCompany}</span>
              </div>
            )}
            {asset.policyNumber && (
              <div className="detail-row">
                <span className="detail-label">保单号</span>
                <span className="detail-value" style={{ fontFamily: 'var(--font-mono)' }}>{asset.policyNumber}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">险种类别</span>
              <span className="detail-value">{asset.insuranceType}</span>
            </div>
            {asset.coverageAmount !== undefined && (
              <div className="detail-row">
                <span className="detail-label">保障额度</span>
                <span className="detail-value">{asset.coverageAmount}万元</span>
              </div>
            )}
            {asset.annualPremium !== undefined && (
              <div className="detail-row">
                <span className="detail-label">年缴保费</span>
                <span className="detail-value">{formatAmount(asset.annualPremium)}</span>
              </div>
            )}
            {asset.paymentYears !== undefined && (
              <div className="detail-row">
                <span className="detail-label">缴费年限</span>
                <span className="detail-value">{asset.paymentYears}年</span>
              </div>
            )}
            {asset.paidYears !== undefined && (
              <div className="detail-row">
                <span className="detail-label">已缴费年限</span>
                <span className="detail-value">{asset.paidYears}年</span>
              </div>
            )}
            {asset.remainingPaymentYears !== undefined && (
              <div className="detail-row">
                <span className="detail-label">剩余缴费年限</span>
                <span className="detail-value">{asset.remainingPaymentYears}年</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">保障期限</span>
              <span className="detail-value">{asset.coveragePeriod}</span>
            </div>
            {asset.cashValue !== undefined && (
              <div className="detail-row">
                <span className="detail-label">现金价值</span>
                <span className="detail-value">{formatAmount(asset.cashValue)}</span>
              </div>
            )}
            {asset.waitingPeriod && (
              <div className="detail-row">
                <span className="detail-label">等待期</span>
                <span className="detail-value">{asset.waitingPeriod}</span>
              </div>
            )}
            {asset.exclusionSummary && (
              <div className="detail-row">
                <span className="detail-label">责任免除</span>
                <span className="detail-value">{asset.exclusionSummary}</span>
              </div>
            )}
          </>
        );

      case 'liability':
        return (
          <>
            {asset.creditor && (
              <div className="detail-row">
                <span className="detail-label">债权人</span>
                <span className="detail-value">{asset.creditor}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">贷款总额</span>
              <span className="detail-value">{formatAmount(asset.totalAmount || 0)}</span>
            </div>
            {asset.paidPrincipal !== undefined && (
              <div className="detail-row">
                <span className="detail-label">已还本金</span>
                <span className="detail-value">{formatAmount(asset.paidPrincipal)}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">剩余本金</span>
              <span className="detail-value">{formatAmount(asset.remainingPrincipal)}</span>
            </div>
            {asset.remainingTerm !== undefined && (
              <div className="detail-row">
                <span className="detail-label">剩余期限</span>
                <span className="detail-value">{asset.remainingTerm}月</span>
              </div>
            )}
            {asset.interestRate !== undefined && (
              <div className="detail-row">
                <span className="detail-label">贷款利率</span>
                <span className="detail-value">{asset.interestRate}%</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">利率类型</span>
              <span className="detail-value">{asset.rateType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">还款方式</span>
              <span className="detail-value">{asset.repaymentMethod}</span>
            </div>
            {asset.monthlyPayment !== undefined && (
              <div className="detail-row">
                <span className="detail-label">月供金额</span>
                <span className="detail-value">{formatAmount(asset.monthlyPayment)}</span>
              </div>
            )}
            {asset.nextPaymentDate && (
              <div className="detail-row">
                <span className="detail-label">下次还款日</span>
                <span className="detail-value">{asset.nextPaymentDate}</span>
              </div>
            )}
            {asset.collateral && (
              <div className="detail-row">
                <span className="detail-label">抵押物</span>
                <span className="detail-value">{asset.collateral}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">是否已抵押</span>
              <span className="detail-value">{asset.isCollateralized ? '是' : '否'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">负债性质</span>
              <span className="detail-value">
                <span className={`badge ${asset.nature === '良性' ? 'badge-success' : asset.nature === '恶性' ? 'badge-danger' : 'badge-warning'}`}>
                  {asset.nature}
                </span>
              </span>
            </div>
          </>
        );

      default:
        return null;
    }
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
              {asset.category === 'liquid' ? '💵' :
               asset.category === 'fixed' ? '🏠' :
               asset.category === 'financial' ? '📈' :
               asset.category === 'protection' ? '🛡️' : '📋'}
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
            color: asset.category === 'liability' ? 'var(--color-danger)' : 'var(--color-text)',
          }}>
            {asset.category === 'liability' ? '-' : '+'}{formatAmount(asset.amount)}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <span>创建于 {format(new Date(asset.createdAt), 'yyyy-MM-dd HH:mm')}</span>
          <span>更新于 {format(new Date(asset.updatedAt), 'yyyy-MM-dd HH:mm')}</span>
        </div>
      </div>

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
