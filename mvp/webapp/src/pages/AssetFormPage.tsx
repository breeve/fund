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
  leaseEndDate?: string;
  loanAmount?: string;
  loanRate?: string;
  loanRemainingTerm?: string;
  depreciationYears?: string;
  productCode?: string;
  quantity?: string;
  costPrice?: string;
  currentPrice?: string;
  insuranceCompany?: string;
  policyNumber?: string;
  insuranceType?: string;
  coverageAmount?: string;
  annualPremium?: string;
  paymentYears?: string;
  paidYears?: string;
  remainingPaymentYears?: string;
  coveragePeriod?: string;
  cashValue?: string;
  waitingPeriod?: string;
  exclusionSummary?: string;
  totalAmount?: string;
  paidPrincipal?: string;
  remainingPrincipal?: string;
  remainingTerm?: string;
  interestRate?: string;
  rateType?: '浮动利率' | '固定利率';
  repaymentMethod?: '等额本息' | '等额本金' | '先息后本';
  monthlyPayment?: string;
  nextPaymentDate?: string;
  creditor?: string;
  collateral?: string;
  isCollateralized?: boolean;
  nature?: '良性' | '恶性' | '待定';
}

const initialFormData: FormData = {
  name: '',
  category: 'liquid',
  subType: '现金类',
  amount: '',
  notes: '',
  tags: '',
  coveragePeriod: '一年期',
  rateType: '浮动利率',
  repaymentMethod: '等额本息',
  nature: '待定',
  isCollateralized: false,
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
        leaseEndDate: 'leaseEndDate' in currentAsset ? currentAsset.leaseEndDate : undefined,
        loanAmount: 'loanAmount' in currentAsset ? String(currentAsset.loanAmount ?? '') : undefined,
        loanRate: 'loanRate' in currentAsset ? String(currentAsset.loanRate ?? '') : undefined,
        loanRemainingTerm: 'loanRemainingTerm' in currentAsset ? String(currentAsset.loanRemainingTerm ?? '') : undefined,
        productCode: 'productCode' in currentAsset ? currentAsset.productCode : undefined,
        quantity: 'quantity' in currentAsset ? String(currentAsset.quantity ?? '') : undefined,
        costPrice: 'costPrice' in currentAsset ? String(currentAsset.costPrice ?? '') : undefined,
        currentPrice: 'currentPrice' in currentAsset ? String(currentAsset.currentPrice ?? '') : undefined,
        insuranceCompany: 'insuranceCompany' in currentAsset ? currentAsset.insuranceCompany : undefined,
        policyNumber: 'policyNumber' in currentAsset ? currentAsset.policyNumber : undefined,
        insuranceType: 'insuranceType' in currentAsset ? currentAsset.insuranceType : undefined,
        coverageAmount: 'coverageAmount' in currentAsset ? String(currentAsset.coverageAmount ?? '') : undefined,
        annualPremium: 'annualPremium' in currentAsset ? String(currentAsset.annualPremium ?? '') : undefined,
        paymentYears: 'paymentYears' in currentAsset ? String(currentAsset.paymentYears ?? '') : undefined,
        paidYears: 'paidYears' in currentAsset ? String(currentAsset.paidYears ?? '') : undefined,
        remainingPaymentYears: 'remainingPaymentYears' in currentAsset ? String(currentAsset.remainingPaymentYears ?? '') : undefined,
        coveragePeriod: 'coveragePeriod' in currentAsset ? currentAsset.coveragePeriod : undefined,
        cashValue: 'cashValue' in currentAsset ? String(currentAsset.cashValue ?? '') : undefined,
        waitingPeriod: 'waitingPeriod' in currentAsset ? currentAsset.waitingPeriod : undefined,
        exclusionSummary: 'exclusionSummary' in currentAsset ? currentAsset.exclusionSummary : undefined,
        totalAmount: 'totalAmount' in currentAsset ? String(currentAsset.totalAmount ?? '') : undefined,
        paidPrincipal: 'paidPrincipal' in currentAsset ? String(currentAsset.paidPrincipal ?? '') : undefined,
        remainingPrincipal: 'remainingPrincipal' in currentAsset ? String(currentAsset.remainingPrincipal ?? '') : undefined,
        remainingTerm: 'remainingTerm' in currentAsset ? String(currentAsset.remainingTerm ?? '') : undefined,
        interestRate: 'interestRate' in currentAsset ? String(currentAsset.interestRate ?? '') : undefined,
        rateType: 'rateType' in currentAsset ? currentAsset.rateType : undefined,
        repaymentMethod: 'repaymentMethod' in currentAsset ? currentAsset.repaymentMethod : undefined,
        monthlyPayment: 'monthlyPayment' in currentAsset ? String(currentAsset.monthlyPayment ?? '') : undefined,
        nextPaymentDate: 'nextPaymentDate' in currentAsset ? currentAsset.nextPaymentDate : undefined,
        creditor: 'creditor' in currentAsset ? currentAsset.creditor : undefined,
        collateral: 'collateral' in currentAsset ? currentAsset.collateral : undefined,
        isCollateralized: 'isCollateralized' in currentAsset ? currentAsset.isCollateralized : undefined,
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
        leaseEndDate: formData.leaseEndDate,
        loanAmount: formData.loanAmount ? parseFloat(formData.loanAmount) : undefined,
        loanRate: formData.loanRate ? parseFloat(formData.loanRate) : undefined,
        loanRemainingTerm: formData.loanRemainingTerm ? parseInt(formData.loanRemainingTerm) : undefined,
        monthlyPayment: formData.monthlyPayment ? parseFloat(formData.monthlyPayment) : undefined,
        depreciationYears: formData.depreciationYears ? parseInt(formData.depreciationYears) : undefined,
      });
    } else if (formData.category === 'financial') {
      Object.assign(assetData, {
        productCode: formData.productCode,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : undefined,
        institution: formData.institution,
      });
    } else if (formData.category === 'protection') {
      Object.assign(assetData, {
        insuranceCompany: formData.insuranceCompany,
        policyNumber: formData.policyNumber,
        insuranceType: formData.insuranceType as '健康险' | '意外险' | '寿险' | '年金险' | '社保/公积金',
        coverageAmount: formData.coverageAmount ? parseFloat(formData.coverageAmount) : undefined,
        annualPremium: formData.annualPremium ? parseFloat(formData.annualPremium) : undefined,
        paymentYears: formData.paymentYears ? parseInt(formData.paymentYears) : undefined,
        paidYears: formData.paidYears ? parseInt(formData.paidYears) : undefined,
        remainingPaymentYears: formData.remainingPaymentYears ? parseInt(formData.remainingPaymentYears) : undefined,
        coveragePeriod: formData.coveragePeriod as '终身' | `至${number}岁` | '一年期',
        cashValue: formData.cashValue ? parseFloat(formData.cashValue) : undefined,
        waitingPeriod: formData.waitingPeriod,
        exclusionSummary: formData.exclusionSummary,
      });
    } else if (formData.category === 'liability') {
      Object.assign(assetData, {
        creditor: formData.creditor,
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        paidPrincipal: formData.paidPrincipal ? parseFloat(formData.paidPrincipal) : undefined,
        remainingPrincipal: formData.remainingPrincipal ? parseFloat(formData.remainingPrincipal) : undefined,
        remainingTerm: formData.remainingTerm ? parseInt(formData.remainingTerm) : undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        rateType: formData.rateType ?? '浮动利率',
        repaymentMethod: formData.repaymentMethod ?? '等额本息',
        monthlyPayment: formData.monthlyPayment ? parseFloat(formData.monthlyPayment) : undefined,
        nextPaymentDate: formData.nextPaymentDate,
        collateral: formData.collateral,
        isCollateralized: formData.isCollateralized,
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
              <>
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
                <div className="form-group">
                  <label className="form-label">租约到期日</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.leaseEndDate ?? ''}
                    onChange={(e) => handleChange('leaseEndDate', e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">折旧年限</label>
              <input
                type="number"
                className="form-input"
                value={formData.depreciationYears ?? ''}
                onChange={(e) => handleChange('depreciationYears', e.target.value)}
                placeholder="年"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">贷款金额</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.loanAmount ?? ''}
                  onChange={(e) => handleChange('loanAmount', e.target.value)}
                  placeholder="元"
                />
              </div>
              <div className="form-group">
                <label className="form-label">贷款利率 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.loanRate ?? ''}
                  onChange={(e) => handleChange('loanRate', e.target.value)}
                  placeholder="如：4.3"
                />
              </div>
            </div>
            {formData.loanAmount && parseFloat(formData.loanAmount) > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">剩余期限（月）</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.loanRemainingTerm ?? ''}
                    onChange={(e) => handleChange('loanRemainingTerm', e.target.value)}
                    placeholder="月"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">月供</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.monthlyPayment ?? ''}
                    onChange={(e) => handleChange('monthlyPayment', e.target.value)}
                    placeholder="元"
                  />
                </div>
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
              <label className="form-label">保险公司</label>
              <input
                type="text"
                className="form-input"
                value={formData.insuranceCompany ?? ''}
                onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                placeholder="如：中国平安保险"
              />
            </div>
            <div className="form-group">
              <label className="form-label">保单号</label>
              <input
                type="text"
                className="form-input"
                value={formData.policyNumber ?? ''}
                onChange={(e) => handleChange('policyNumber', e.target.value)}
                placeholder="保单上的合同号"
              />
            </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">缴费年限</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.paymentYears ?? ''}
                  onChange={(e) => handleChange('paymentYears', e.target.value)}
                  placeholder="如：20"
                />
              </div>
              <div className="form-group">
                <label className="form-label">已缴费年限</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.paidYears ?? ''}
                  onChange={(e) => handleChange('paidYears', e.target.value)}
                  placeholder="如：5"
                />
              </div>
            </div>
            {formData.paymentYears && formData.paidYears && (
              <div className="form-group">
                <label className="form-label">剩余缴费年限</label>
                <input
                  type="number"
                  className="form-input"
                  value={String((parseInt(formData.paymentYears) || 0) - (parseInt(formData.paidYears) || 0))}
                  readOnly
                  placeholder="自动计算"
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">保障期限</label>
              <select
                className="form-input form-select"
                value={formData.coveragePeriod ?? '一年期'}
                onChange={(e) => handleChange('coveragePeriod', e.target.value)}
              >
                <option value="一年期">一年期</option>
                <option value="终身">终身</option>
                <option value="至60岁">至60岁</option>
                <option value="至70岁">至70岁</option>
                <option value="至80岁">至80岁</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">现金价值</label>
              <input
                type="number"
                className="form-input"
                value={formData.cashValue ?? ''}
                onChange={(e) => handleChange('cashValue', e.target.value)}
                placeholder="元"
              />
            </div>
            <div className="form-group">
              <label className="form-label">等待期（天）</label>
              <input
                type="number"
                className="form-input"
                value={formData.waitingPeriod ?? ''}
                onChange={(e) => handleChange('waitingPeriod', e.target.value)}
                placeholder="如：90"
              />
            </div>
            <div className="form-group">
              <label className="form-label">责任免除摘要</label>
              <textarea
                className="form-input"
                rows={2}
                value={formData.exclusionSummary ?? ''}
                onChange={(e) => handleChange('exclusionSummary', e.target.value)}
                placeholder="主要责任免除条款..."
              />
            </div>
          </>
        );

      case 'liability':
        return (
          <>
            <div className="form-group">
              <label className="form-label">债权人</label>
              <input
                type="text"
                className="form-input"
                value={formData.creditor ?? ''}
                onChange={(e) => handleChange('creditor', e.target.value)}
                placeholder="如：中国建设银行"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
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
                <label className="form-label">已还本金</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.paidPrincipal ?? ''}
                  onChange={(e) => handleChange('paidPrincipal', e.target.value)}
                  placeholder="元"
                />
              </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">剩余期限（月）</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.remainingTerm ?? ''}
                  onChange={(e) => handleChange('remainingTerm', e.target.value)}
                  placeholder="月"
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
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">利率类型</label>
                <select
                  className="form-input form-select"
                  value={formData.rateType ?? '浮动利率'}
                  onChange={(e) => handleChange('rateType', e.target.value)}
                >
                  <option value="浮动利率">浮动利率</option>
                  <option value="固定利率">固定利率</option>
                </select>
              </div>
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
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">月供金额</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthlyPayment ?? ''}
                  onChange={(e) => handleChange('monthlyPayment', e.target.value)}
                  placeholder="元"
                />
              </div>
              <div className="form-group">
                <label className="form-label">下次还款日</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.nextPaymentDate ?? ''}
                  onChange={(e) => handleChange('nextPaymentDate', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">抵押物</label>
              <input
                type="text"
                className="form-input"
                value={formData.collateral ?? ''}
                onChange={(e) => handleChange('collateral', e.target.value)}
                placeholder="如：房产证"
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isCollateralized ?? false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isCollateralized: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
                <span>已抵押</span>
              </label>
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