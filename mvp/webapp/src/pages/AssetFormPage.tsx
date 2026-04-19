import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssetStore } from '@/store';
import { ASSET_SUB_TYPES, CATEGORY_NAMES, GEO_TAGS, RISK_TAGS, SOURCE_TAGS, type AssetCategory, type Asset, type SourceTag } from '@/types';

interface FormData {
  name: string;
  category: AssetCategory;
  subType: string;
  tags: string;
  notes: string;
  entryTime: string;
  // 资产来源 (source)
  source: SourceTag;
  // 公募基金/私募基金 specific
  code?: string;
  sharpeRatio?: string;
  topHoldings?: string;
  // 金融类 (fund/private_fund/strategy/derivative) shared
  total?: string;
  cost?: string;
  profit?: string;
  returnRate?: string;
  // 定期 specific
  duration?: string;
  startDate?: string;
  annualReturn?: string;
  investmentAmount?: string;
}

const initialFormData: FormData = {
  name: '',
  category: 'liquid',
  subType: '余额宝',
  tags: '',
  notes: '',
  entryTime: new Date().toISOString().slice(0, 10),
  source: '银行',
};

export function AssetFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { assets, addAsset, updateAsset, adjustAsset } = useAssetStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [adjustReason, setAdjustReason] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const isEditing = !!id;
  const currentAsset = id ? assets.find((a) => a.id === id) : null;

  useEffect(() => {
    if (currentAsset) {
      const tags = currentAsset.tags.join(', ');
      setFormData({
        name: currentAsset.name,
        category: currentAsset.category,
        subType: currentAsset.subType,
        tags,
        notes: currentAsset.notes,
        entryTime: currentAsset.entryTime.slice(0, 10),
        source: 'source' in currentAsset ? currentAsset.source : '其他',
        code: 'code' in currentAsset ? (currentAsset.code ?? '') : '',
        sharpeRatio: 'sharpeRatio' in currentAsset ? String(currentAsset.sharpeRatio ?? '') : '',
        topHoldings: 'topHoldings' in currentAsset ? (currentAsset.topHoldings?.join(', ') ?? '') : '',
        total: 'total' in currentAsset ? String(currentAsset.total ?? '') : '',
        cost: 'cost' in currentAsset ? String(currentAsset.cost ?? '') : '',
        profit: 'profit' in currentAsset ? String(currentAsset.profit ?? '') : '',
        returnRate: 'returnRate' in currentAsset ? String(currentAsset.returnRate ?? '') : '',
        duration: 'duration' in currentAsset ? String(currentAsset.duration ?? '') : '',
        startDate: 'startDate' in currentAsset ? currentAsset.startDate : '',
        annualReturn: 'annualReturn' in currentAsset ? String(currentAsset.annualReturn ?? '') : '',
        investmentAmount: 'investmentAmount' in currentAsset ? String(currentAsset.investmentAmount ?? '') : '',
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

    if (!formData.entryTime) {
      newErrors.entryTime = '请选择录入时间';
    }

    // Validate financial assets
    if (['fund', 'private_fund', 'strategy', 'derivative'].includes(formData.category)) {
      if (!formData.total || parseFloat(formData.total) <= 0) {
        newErrors.total = '请输入有效的总额度';
      }
      if (!formData.cost || parseFloat(formData.cost) <= 0) {
        newErrors.cost = '请输入持有成本';
      }
    }

    // Validate fixed term
    if (formData.category === 'fixed') {
      if (!formData.investmentAmount || parseFloat(formData.investmentAmount) <= 0) {
        newErrors.investmentAmount = '请输入投资金额';
      }
      if (!formData.startDate) {
        newErrors.startDate = '请选择起投日期';
      }
    }

    // Validate liquid
    if (formData.category === 'liquid') {
      if (!formData.total || parseFloat(formData.total) <= 0) {
        newErrors.total = '请输入总额度';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildAssetData = (): Asset => {
    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const baseData = {
      name: formData.name.trim(),
      category: formData.category,
      subType: formData.subType,
      tags,
      notes: formData.notes,
      entryTime: formData.entryTime,
    };

    switch (formData.category) {
      case 'fund':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          code: formData.code || undefined,
          sharpeRatio: formData.sharpeRatio ? parseFloat(formData.sharpeRatio) : undefined,
          topHoldings: formData.topHoldings
            ? formData.topHoldings.split(',').map((t) => t.trim()).filter(Boolean)
            : undefined,
          total: parseFloat(formData.total || '0'),
          cost: parseFloat(formData.cost || '0'),
          profit: parseFloat(formData.profit || '0'),
          returnRate: parseFloat(formData.returnRate || '0'),
        } as Asset;
      case 'private_fund':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          code: formData.code || undefined,
          total: parseFloat(formData.total || '0'),
          cost: parseFloat(formData.cost || '0'),
          profit: parseFloat(formData.profit || '0'),
          returnRate: parseFloat(formData.returnRate || '0'),
        } as Asset;
      case 'strategy':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          total: parseFloat(formData.total || '0'),
          cost: parseFloat(formData.cost || '0'),
          profit: parseFloat(formData.profit || '0'),
          returnRate: parseFloat(formData.returnRate || '0'),
        } as Asset;
      case 'fixed':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          duration: parseInt(formData.duration || '0'),
          startDate: formData.startDate || '',
          annualReturn: parseFloat(formData.annualReturn || '0'),
          investmentAmount: parseFloat(formData.investmentAmount || '0'),
        } as Asset;
      case 'liquid':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          total: parseFloat(formData.total || '0'),
        } as Asset;
      case 'derivative':
        return {
          ...baseData,
          source: formData.source as SourceTag,
          total: parseFloat(formData.total || '0'),
          cost: parseFloat(formData.cost || '0'),
          profit: parseFloat(formData.profit || '0'),
          returnRate: parseFloat(formData.returnRate || '0'),
        } as Asset;
      case 'protection':
        return baseData as Asset;
      default:
        return baseData as Asset;
    }
  };

  const calculateReturnRate = () => {
    const cost = parseFloat(formData.cost || '0');
    const profit = parseFloat(formData.profit || '0');
    if (cost > 0) {
      return ((profit / cost) * 100).toFixed(2);
    }
    return '0';
  };

  const handleSubmit = (e: React.FormEvent, isAdjustment = false) => {
    e.preventDefault();

    if (!validate()) return;

    const assetData = buildAssetData();

    if (isAdjustment && id) {
      adjustAsset(id, assetData, adjustReason);
    } else if (isEditing && id) {
      updateAsset(id, assetData);
    } else {
      addAsset(assetData);
    }

    navigate('/assets');
  };

  const renderCategoryFields = () => {
    switch (formData.category) {
      case 'fund':
        return (
          <>
            <div className="form-group">
              <label className="form-label">基金编码</label>
              <input
                type="text"
                className="form-input"
                value={formData.code ?? ''}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="如：000961"
              />
            </div>
            <div className="form-group">
              <label className="form-label">夏普比率</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.sharpeRatio ?? ''}
                onChange={(e) => handleChange('sharpeRatio', e.target.value)}
                placeholder="如：0.85"
              />
            </div>
            <div className="form-group">
              <label className="form-label">重仓股票</label>
              <input
                type="text"
                className="form-input"
                value={formData.topHoldings ?? ''}
                onChange={(e) => handleChange('topHoldings', e.target.value)}
                placeholder="用逗号分隔，如：贵州茅台,宁德时代"
              />
            </div>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">总额度 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.total ? 'form-error' : ''}`}
                value={formData.total ?? ''}
                onChange={(e) => handleChange('total', e.target.value)}
                placeholder="包含本金+收益"
              />
              {errors.total && <div className="form-error">{errors.total}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">持有成本 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-input ${errors.cost ? 'form-error' : ''}`}
                  value={formData.cost ?? ''}
                  onChange={(e) => handleChange('cost', e.target.value)}
                />
                {errors.cost && <div className="form-error">{errors.cost}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">持有收益 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.profit ?? ''}
                  onChange={(e) => handleChange('profit', e.target.value)}
                  onBlur={() => handleChange('returnRate', calculateReturnRate())}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">持有收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.returnRate ?? ''}
                onChange={(e) => handleChange('returnRate', e.target.value)}
                placeholder="自动计算或手动输入"
              />
              <div className="form-hint">收益 / 成本 × 100</div>
            </div>
          </>
        );

      case 'private_fund':
        return (
          <>
            <div className="form-group">
              <label className="form-label">基金编码</label>
              <input
                type="text"
                className="form-input"
                value={formData.code ?? ''}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="如：PF2023001"
              />
            </div>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">总额度 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.total ? 'form-error' : ''}`}
                value={formData.total ?? ''}
                onChange={(e) => handleChange('total', e.target.value)}
                placeholder="包含本金+收益"
              />
              {errors.total && <div className="form-error">{errors.total}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">持有成本 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-input ${errors.cost ? 'form-error' : ''}`}
                  value={formData.cost ?? ''}
                  onChange={(e) => handleChange('cost', e.target.value)}
                />
                {errors.cost && <div className="form-error">{errors.cost}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">持有收益 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.profit ?? ''}
                  onChange={(e) => handleChange('profit', e.target.value)}
                  onBlur={() => handleChange('returnRate', calculateReturnRate())}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">持有收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.returnRate ?? ''}
                onChange={(e) => handleChange('returnRate', e.target.value)}
              />
            </div>
          </>
        );

      case 'strategy':
        return (
          <>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">总额度 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.total ? 'form-error' : ''}`}
                value={formData.total ?? ''}
                onChange={(e) => handleChange('total', e.target.value)}
                placeholder="包含本金+收益"
              />
              {errors.total && <div className="form-error">{errors.total}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">持有成本 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-input ${errors.cost ? 'form-error' : ''}`}
                  value={formData.cost ?? ''}
                  onChange={(e) => handleChange('cost', e.target.value)}
                />
                {errors.cost && <div className="form-error">{errors.cost}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">持有收益 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.profit ?? ''}
                  onChange={(e) => handleChange('profit', e.target.value)}
                  onBlur={() => handleChange('returnRate', calculateReturnRate())}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">持有收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.returnRate ?? ''}
                onChange={(e) => handleChange('returnRate', e.target.value)}
              />
            </div>
          </>
        );

      case 'fixed':
        return (
          <>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">年限</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.duration ?? ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="如：1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">起投日期 <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input
                  type="date"
                  className={`form-input ${errors.startDate ? 'form-error' : ''}`}
                  value={formData.startDate ?? ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
                {errors.startDate && <div className="form-error">{errors.startDate}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">年化收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.annualReturn ?? ''}
                onChange={(e) => handleChange('annualReturn', e.target.value)}
                placeholder="如：2.1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">投资金额 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.investmentAmount ? 'form-error' : ''}`}
                value={formData.investmentAmount ?? ''}
                onChange={(e) => handleChange('investmentAmount', e.target.value)}
                placeholder="元"
              />
              {errors.investmentAmount && <div className="form-error">{errors.investmentAmount}</div>}
            </div>
          </>
        );

      case 'liquid':
        return (
          <>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">总额度 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.total ? 'form-error' : ''}`}
                value={formData.total ?? ''}
                onChange={(e) => handleChange('total', e.target.value)}
              />
              {errors.total && <div className="form-error">{errors.total}</div>}
            </div>
          </>
        );

      case 'derivative':
        return (
          <>
            <div className="form-group">
              <label className="form-label">资产来源</label>
              <select
                className="form-input form-select"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
              >
                {SOURCE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">总额度 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                className={`form-input ${errors.total ? 'form-error' : ''}`}
                value={formData.total ?? ''}
                onChange={(e) => handleChange('total', e.target.value)}
              />
              {errors.total && <div className="form-error">{errors.total}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">持有成本 (元) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-input ${errors.cost ? 'form-error' : ''}`}
                  value={formData.cost ?? ''}
                  onChange={(e) => handleChange('cost', e.target.value)}
                />
                {errors.cost && <div className="form-error">{errors.cost}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">持有收益 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.profit ?? ''}
                  onChange={(e) => handleChange('profit', e.target.value)}
                  onBlur={() => handleChange('returnRate', calculateReturnRate())}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">持有收益率 (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.returnRate ?? ''}
                onChange={(e) => handleChange('returnRate', e.target.value)}
              />
            </div>
          </>
        );

      case 'protection':
        return (
          <div className="form-hint" style={{ padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            保障类资产只需填写基本信息，子类别已在上方选择
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEditing ? '编辑资产' : '添加资产'}</h1>
        <p className="page-description">录入您的资产信息，用于后续趋势分析</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 600 }}>
        {/* Category Selection */}
        <div className="form-group">
          <label className="form-label">资产类别</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 'var(--space-2)' }}>
            {(Object.keys(CATEGORY_NAMES) as AssetCategory[]).map((category) => (
              <button
                key={category}
                type="button"
                className={`btn ${formData.category === category ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleCategoryChange(category)}
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
            录入时间 <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="date"
            className={`form-input ${errors.entryTime ? 'form-error' : ''}`}
            value={formData.entryTime}
            onChange={(e) => handleChange('entryTime', e.target.value)}
          />
          <div className="form-hint">记录该资产的录入日期，用于趋势分析</div>
          {errors.entryTime && <div className="form-error">{errors.entryTime}</div>}
        </div>

        {/* Category-specific Fields */}
        {renderCategoryFields()}

        {/* Tags - Geographic and Risk */}
        <div className="form-group">
          <label className="form-label">地域标签</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {GEO_TAGS.map((tag) => (
              <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag)}
                  onChange={(e) => {
                    const newTags = e.target.checked
                      ? [...formData.tags.split(',').map(t => t.trim()).filter(Boolean), tag]
                      : formData.tags.split(',').map(t => t.trim()).filter(Boolean).filter(t => t !== tag);
                    handleChange('tags', newTags.join(', '));
                  }}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">风险标签</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {RISK_TAGS.map((tag) => (
              <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag)}
                  onChange={(e) => {
                    const newTags = e.target.checked
                      ? [...formData.tags.split(',').map(t => t.trim()).filter(Boolean), tag]
                      : formData.tags.split(',').map(t => t.trim()).filter(Boolean).filter(t => t !== tag);
                    handleChange('tags', newTags.join(', '));
                  }}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Tags */}
        <div className="form-group">
          <label className="form-label">自定义标签</label>
          <input
            type="text"
            className="form-input"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="用逗号分隔，如：核心资产,长期持有"
          />
          <div className="form-hint">地域和风险标签会自动合并</div>
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
          {isEditing && (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => setShowAdjustModal(true)}
            >
              调整
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {isEditing ? '保存修改' : '添加资产'}
          </button>
        </div>
      </form>

      {/* Adjustment Modal */}
      {showAdjustModal && (
        <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">调整资产</h3>
            <p className="modal-description">
              调整将创建一条新的记录，保留历史数据用于趋势分析。
            </p>
            <div className="form-group">
              <label className="form-label">调整原因</label>
              <textarea
                className="form-input"
                rows={2}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="如：加仓、补仓、减仓、分红再投..."
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAdjustModal(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => handleSubmit(e, true)}
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
