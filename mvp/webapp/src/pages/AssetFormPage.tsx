import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssetStore } from '@/store';
import { ASSET_SUB_TYPES, CATEGORY_NAMES, type AssetCategory, type Asset } from '@/types';

interface FormData {
  name: string;
  category: AssetCategory;
  subType: string;
  amount: string;
  notes: string;
  tags: string;
  // Additional fields based on category
  institution?: string;
  productName?: string;
  annualYield?: string;
  purchaseDate?: string;
  purchaseAmount?: string;
  currentValue?: string;
  holdingPurpose?: '自用' | '投资';
  status?: '自住' | '出租' | '空置';
  monthlyRent?: string;
  productCode?: string;
  quantity?: string;
  costPrice?: string;
  currentPrice?: string;
  insuranceType?: string;
  coverageAmount?: string;
  annualPremium?: string;
  totalAmount?: string;
  remainingPrincipal?: string;
  interestRate?: string;
  repaymentMethod?: '等额本息' | '等额本金' | '先息后本';
  nature?: '良性' | '恶性' | '待定';
}

const initialFormData: FormData = {
  name: '',
  category: 'liquid',
  subType: '现金类',
  amount: '',
  notes: '',
  tags: '',
};

export function AssetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { assets, addAsset, updateAsset } = useAssetStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const isEditing = !!id;
  const currentAsset = id ? assets.find((a) => a.id === id) : null;

  useEffect(() => {
    if (currentAsset) {
      setFormData({
        name: currentAsset.name,
        category: currentAsset.category,
        subType: currentAsset.subType,
        amount: String(currentAsset.amount),
        notes: currentAsset.notes,
        tags: currentAsset.tags.join(', '),
        // Copy category-specific fields
        institution: 'institution' in currentAsset ? currentAsset.institution : undefined,
        productName: 'productName' in currentAsset ? currentAsset.productName : undefined,
        annualYield: 'annualYield' in currentAsset ? String(currentAsset.annualYield ?? '') : undefined,
        purchaseDate: 'purchaseDate' in currentAsset ? currentAsset.purchaseDate : undefined,
        purchaseAmount: 'purchaseAmount' in currentAsset ? String(currentAsset.purchaseAmount ?? '') : undefined,
        currentValue: 'currentValue' in currentAsset ? String(currentAsset.currentValue ?? '') : undefined,
        holdingPurpose: 'holdingPurpose' in currentAsset ? currentAsset.holdingPurpose : undefined,
        status: 'status' in currentAsset ? currentAsset.status : undefined,
        monthlyRent: 'monthlyRent' in currentAsset ? String(currentAsset.monthlyRent ?? '') : undefined,
        productCode: 'productCode' in currentAsset ? currentAsset.productCode : undefined,
        quantity: 'quantity' in currentAsset ? String(currentAsset.quantity ?? '') : undefined,
        costPrice: 'costPrice' in currentAsset ? String(currentAsset.costPrice ?? '') : undefined,
        currentPrice: 'currentPrice' in currentAsset ? String(currentAsset.currentPrice ?? '') : undefined,
        insuranceType: 'insuranceType' in currentAsset ? currentAsset.insuranceType : undefined,
        coverageAmount: 'coverageAmount' in currentAsset ? String(currentAsset.coverageAmount ?? '') : undefined,
        annualPremium: 'annualPremium' in currentAsset ? String(currentAsset.annualPremium ?? '') : undefined,
        totalAmount: 'totalAmount' in currentAsset ? String(currentAsset.totalAmount ?? '') : undefined,
        remainingPrincipal: 'remainingPrincipal' in currentAsset ? String(currentAsset.remainingPrincipal ?? '') : undefined,
        interestRate: 'interestRate' in currentAsset ? String(currentAsset.interestRate ?? '') : undefined,
        repaymentMethod: 'repaymentMethod' in currentAsset ? currentAsset.repaymentMethod : undefined,
        nature: 'nature' in currentAsset ? currentAsset.nature : undefined,
      });
    }
  }, [currentAsset]);

  const handleCategoryChange = (category: AssetCategory) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subType: ASSET_SUB_TYPES[category]?.[0] ?? '',
    }));
    setErrors({});
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入资产名称';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = '请输入有效的金额';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      category: formData.category,
      subType: formData.subType,
      amount: parseFloat(formData.amount),
      currency: 'CNY',
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      notes: formData.notes,
    };

    // Add category-specific fields
    if (formData.category === 'liquid') {
      Object.assign(assetData, {
        institution: formData.institution,
        productName: formData.productName,
        annualYield: formData.annualYield ? parseFloat(formData.annualYield) : undefined,
      });
    } else if (formData.category === 'fixed') {
      Object.assign(assetData, {
        purchaseDate: formData.purchaseDate ?? '',
        purchaseAmount: formData.purchaseAmount ? parseFloat(formData.purchaseAmount) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        holdingPurpose: formData.holdingPurpose ?? '自用',
        status: formData.status ?? '自住',
        monthlyRent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : undefined,
      });
    } else if (formData.category === 'financial') {
      Object.assign(assetData, {
        productCode: formData.productCode,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : undefined,
        institution: formData.institution,
      });
    } else if (formData.category === 'liability') {
      Object.assign(assetData, {
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        remainingPrincipal: formData.remainingPrincipal ? parseFloat(formData.remainingPrincipal) : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        repaymentMethod: formData.repaymentMethod ?? '等额本息',
        nature: formData.nature ?? '待定',
      });
    }

    if (isEditing && id) {
      updateAsset(id, assetData);
    } else {
      addAsset(assetData);
    }

    navigate('/assets');
  };

  const renderCategoryFields = () => {
    switch (formData.category) {
      case 'liquid':
        return (
          <>
            <div className="form-group">
              <label className="form-label">开户机构</label>
              <input
                type="text"
                className="form-input"
                value={formData.institution ?? ''}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="如：招商银行"
              />
            </div>
            <div className="form-group">
              <label className="form-label">产品名称</label>
              <input
                type="text"
                className="form-input"
                value={formData.productName ?? ''}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="如：天弘余额宝货币"
              />
            </div>
            <div className="form-group">
              <label className="form-label">年化收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.annualYield ?? ''}
                onChange={(e) => handleChange('annualYield', e.target.value)}
                placeholder="如：1.8"
              />
              <div className="form-hint">仅供参考，非保证收益</div>
            </div>
          </>
        );

      case 'fixed':
        return (
          <>
            <div className="form-group">
              <label className="form-label">购买日期</label>
              <input
                type="date"
                className="form-input"
                value={formData.purchaseDate ?? ''}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">购买金额</label>
              <input
                type="number"
                className="form-input"
                value={formData.purchaseAmount ?? ''}
                onChange={(e) => handleChange('purchaseAmount', e.target.value)}
                placeholder="元"
              />
            </div>
            <div className="form-group">
              <label className="form-label">当前估值</label>
              <input
                type="number"
                className="form-input"
                value={formData.currentValue ?? ''}
                onChange={(e) => handleChange('currentValue', e.target.value)}
                placeholder="元"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">持有目的</label>
                <select
                  className="form-input form-select"
                  value={formData.holdingPurpose ?? '自用'}
                  onChange={(e) => handleChange('holdingPurpose', e.target.value)}
                >
                  <option value="自用">自用</option>
                  <option value="投资">投资</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">当前状态</label>
                <select
                  className="form-input form-select"
                  value={formData.status ?? '自住'}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="自住">自住</option>
                  <option value="出租">出租</option>
                  <option value="空置">空置</option>
                </select>
              </div>
            </div>
            {formData.status === '出租' && (
              <div className="form-group">
                <label className="form-label">月租金</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthlyRent ?? ''}
                  onChange={(e) => handleChange('monthlyRent', e.target.value)}
                  placeholder="元/月"
                />
              </div>
            )}
          </>
        );

      case 'financial':
        return (
          <>
            <div className="form-group">
              <label className="form-label">产品代码</label>
              <input
                type="text"
                className="form-input"
                value={formData.productCode ?? ''}
                onChange={(e) => handleChange('productCode', e.target.value)}
                placeholder="如：000961"
              />
            </div>
            <div className="form-group">
              <label className="form-label">持有数量/份额</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity ?? ''}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">成本单价</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  value={formData.costPrice ?? ''}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">当前单价</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  value={formData.currentPrice ?? ''}
                  onChange={(e) => handleChange('currentPrice', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">账户所在机构</label>
              <input
                type="text"
                className="form-input"
                value={formData.institution ?? ''}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="如：天天基金、支付宝"
              />
            </div>
          </>
        );

      case 'protection':
        return (
          <>
            <div className="form-group">
              <label className="form-label">险种类别</label>
              <select
                className="form-input form-select"
                value={formData.insuranceType ?? '健康险'}
                onChange={(e) => handleChange('insuranceType', e.target.value)}
              >
                <option value="健康险">健康险</option>
                <option value="意外险">意外险</option>
                <option value="寿险">寿险</option>
                <option value="年金险">年金险</option>
                <option value="社保/公积金">社保/公积金</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">保障额度（万元）</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.coverageAmount ?? ''}
                  onChange={(e) => handleChange('coverageAmount', e.target.value)}
                  placeholder="如：50"
                />
              </div>
              <div className="form-group">
                <label className="form-label">年缴保费（元）</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.annualPremium ?? ''}
                  onChange={(e) => handleChange('annualPremium', e.target.value)}
                  placeholder="如：5000"
                />
              </div>
            </div>
          </>
        );

      case 'liability':
        return (
          <>
            <div className="form-group">
              <label className="form-label">贷款总额</label>
              <input
                type="number"
                className="form-input"
                value={formData.totalAmount ?? ''}
                onChange={(e) => handleChange('totalAmount', e.target.value)}
                placeholder="元"
              />
            </div>
            <div className="form-group">
              <label className="form-label">剩余本金</label>
              <input
                type="number"
                className="form-input"
                value={formData.remainingPrincipal ?? ''}
                onChange={(e) => handleChange('remainingPrincipal', e.target.value)}
                placeholder="元"
              />
            </div>
            <div className="form-group">
              <label className="form-label">贷款利率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.interestRate ?? ''}
                onChange={(e) => handleChange('interestRate', e.target.value)}
                placeholder="如：4.3"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">还款方式</label>
                <select
                  className="form-input form-select"
                  value={formData.repaymentMethod ?? '等额本息'}
                  onChange={(e) => handleChange('repaymentMethod', e.target.value)}
                >
                  <option value="等额本息">等额本息</option>
                  <option value="等额本金">等额本金</option>
                  <option value="先息后本">先息后本</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">负债性质</label>
                <select
                  className="form-input form-select"
                  value={formData.nature ?? '待定'}
                  onChange={(e) => handleChange('nature', e.target.value)}
                >
                  <option value="良性">良性</option>
                  <option value="恶性">恶性</option>
                  <option value="待定">待定</option>
                </select>
              </div>
            </div>
            {formData.nature === '良性' && (
              <div className="badge badge-success">
                良性负债：利率较低，用于购买能增值或产生收益的资产
              </div>
            )}
            {formData.nature === '恶性' && (
              <div className="badge badge-danger">
                恶性负债：利率较高，用于纯消费，无资产增值可能
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEditing ? '编辑资产' : '添加资产'}</h1>
        <p className="page-description">录入您的资产信息</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 600 }}>
        {/* Category Selection */}
        <div className="form-group">
          <label className="form-label">资产类别</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-2)' }}>
            {(Object.keys(CATEGORY_NAMES) as AssetCategory[]).map((category) => (
              <button
                key={category}
                type="button"
                className={`btn ${formData.category === category ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleCategoryChange(category)}
                style={formData.category === category ? {} : {
                  borderColor: `var(--color-${category})`,
                  color: `var(--color-${category})`,
                }}
              >
                {CATEGORY_NAMES[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-type Selection */}
        <div className="form-group">
          <label className="form-label">子类别</label>
          <select
            className="form-input form-select"
            value={formData.subType}
            onChange={(e) => handleChange('subType', e.target.value)}
          >
            {ASSET_SUB_TYPES[formData.category]?.map((subType) => (
              <option key={subType} value={subType}>
                {subType}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Fields */}
        <div className="form-group">
          <label className="form-label">
            名称 <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'form-error' : ''}`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="给资产起个名字"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">
            金额 <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-input ${errors.amount ? 'form-error' : ''}`}
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="元"
          />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>

        {/* Category-specific Fields */}
        {renderCategoryFields()}

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">标签</label>
          <input
            type="text"
            className="form-input"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="用逗号分隔，如：日常备用,核心资产"
          />
          <div className="form-hint">用逗号分隔多个标签</div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">备注</label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="补充说明..."
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/assets')}
          >
            取消
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? '保存修改' : '添加资产'}
          </button>
        </div>
      </form>
    </div>
  );
}