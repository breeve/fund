import { useState, useRef } from 'react';
import { useConfigStore, MARKET_DATA_PROVIDERS, LLM_PROVIDERS, DEFAULT_API_ENDPOINTS } from '@/store';
import { saveAs } from 'file-saver';
import { useAssetStore } from '@/store';
import { exportAssetsToExcel, importAssetsFromExcel, EXCEL_CONFIG_VERSION } from '@/services/assetExcel';
import type { Asset } from '@/types';
import type { AppConfig } from '@/types';

export function SettingsPage() {
  const { config, preferences, setTheme, setLocale, setDefaultView, setShowTips, setMarketDataProvider, setLLMProvider, setLLMModel, setCustomApiEndpoints } = useConfigStore();
  const { assets, addAsset } = useAssetStore();
  const [exportStatus, setExportStatus] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom API endpoints state
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [customEndpoints, setCustomEndpoints] = useState<NonNullable<AppConfig['customApiEndpoints']>>({
    fundInfo: config.customApiEndpoints?.fundInfo ?? DEFAULT_API_ENDPOINTS.fundInfo,
    fundNav: config.customApiEndpoints?.fundNav ?? DEFAULT_API_ENDPOINTS.fundNav,
    fundHoldings: config.customApiEndpoints?.fundHoldings ?? DEFAULT_API_ENDPOINTS.fundHoldings,
  });

  const handleSaveCustomEndpoints = () => {
    setCustomApiEndpoints(customEndpoints);
    setShowAdvancedConfig(false);
  };

  const handleResetEndpoints = () => {
    setCustomEndpoints(DEFAULT_API_ENDPOINTS);
  };

  const handleExport = async (format: 'json' | 'csv' | 'excel') => {
    try {
      if (format === 'json') {
        const data = JSON.stringify({ assets, exportedAt: new Date().toISOString() }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, `fund-assets-${new Date().toISOString().split('T')[0]}.json`);
      } else if (format === 'csv') {
        // CSV export
        const headers = ['名称', '类别', '子类别', '总额度', '标签', '备注', '录入时间', '创建时间', '更新时间'];
        const rows = assets.map((a) => [
          a.name,
          a.category,
          a.subType,
          'total' in a ? a.total : 'investmentAmount' in a ? a.investmentAmount : 0,
          a.tags.join(';'),
          a.notes,
          a.entryTime,
          a.createdAt,
          a.updatedAt,
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `fund-assets-${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        // Excel export
        exportAssetsToExcel(assets);
      }
      setExportStatus('导出成功');
      setTimeout(() => setExportStatus(''), 3000);
    } catch {
      setExportStatus('导出失败');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Excel import
        const result = await importAssetsFromExcel(file);

        if (!result.success) {
          setImportStatus(result.errors[0] ?? '导入失败');
          setTimeout(() => setImportStatus(''), 4000);
          return;
        }

        let successCount = 0;
        for (const assetData of result.assets) {
          try {
            addAsset(assetData);
            successCount++;
          } catch {
            // Skip invalid assets
          }
        }

        const versionNote = result.version < EXCEL_CONFIG_VERSION
          ? `（检测到格式版本 V${result.version}，已自动适配）`
          : '';
        setImportStatus(`Excel 导入成功 ${successCount} 笔${versionNote}`);
        setTimeout(() => setImportStatus(''), 5000);
      } else {
        // JSON or CSV import
        const text = await file.text();
        let importedAssets: Asset[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          importedAssets = parsed.assets || [];
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            setImportStatus('CSV 文件格式错误');
            return;
          }
          // Skip header, parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
            if (values.length >= 7 && values[0] && values[1]) {
              const category = values[1] as Asset['category'];
              // Build asset based on category
              const baseAsset = {
                name: values[0],
                category,
                subType: values[2] ?? '',
                tags: values[4] ? values[4].split(';') : [],
                notes: values[5] ?? '',
                entryTime: values[6] || new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              // Add category-specific fields
              if (category === 'fixed') {
                importedAssets.push({
                  ...baseAsset,
                  investmentAmount: parseFloat(values[3] ?? '') || 0,
                } as Asset);
              } else if (category !== 'protection') {
                importedAssets.push({
                  ...baseAsset,
                  total: parseFloat(values[3] ?? '') || 0,
                } as Asset);
              } else {
                importedAssets.push(baseAsset as Asset);
              }
            }
          }
        }

        if (importedAssets.length === 0) {
          setImportStatus('未找到可导入的资产数据');
          return;
        }

        // Add imported assets to store
        let successCount = 0;
        for (const assetData of importedAssets) {
          try {
            addAsset(assetData);
            successCount++;
          } catch {
            // Skip invalid assets
          }
        }

        setImportStatus(`成功导入 ${successCount} 笔资产`);
        setTimeout(() => setImportStatus(''), 3000);
      }
    } catch {
      setImportStatus('导入失败，请检查文件格式');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">设置</h1>
        <p className="page-description">配置应用偏好和数据管理</p>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">外观</h2>
        </div>

        <div className="form-group">
          <label className="form-label">主题</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['light', 'dark', 'auto'] as const).map((themeOption) => (
              <button
                key={themeOption}
                className={`btn ${preferences.theme === themeOption ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTheme(themeOption)}
              >
                {themeOption === 'light' ? '☀️ 浅色' : themeOption === 'dark' ? '🌙 深色' : '⚙️ 跟随系统'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">语言</label>
          <select
            className="form-input form-select"
            style={{ maxWidth: 200 }}
            value={preferences.locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>

      {/* Data Display */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">数据显示</h2>
        </div>

        <div className="form-group">
          <label className="form-label">默认视图</label>
          <select
            className="form-input form-select"
            style={{ maxWidth: 200 }}
            value={preferences.defaultView}
            onChange={(e) => setDefaultView(e.target.value as 'overview' | 'list' | 'charts')}
          >
            <option value="overview">资产总览</option>
            <option value="list">资产列表</option>
            <option value="charts">图表视图</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.showTips}
              onChange={(e) => setShowTips(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span>显示操作提示</span>
          </label>
        </div>
      </div>

      {/* Fund Data Source Configuration */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">数据源配置</h2>
        </div>

        <div className="form-group">
          <label className="form-label">行情数据源</label>
          <select
            className="form-input form-select"
            value={config.marketDataProvider}
            onChange={(e) => setMarketDataProvider(e.target.value)}
          >
            {MARKET_DATA_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="form-hint">
            {MARKET_DATA_PROVIDERS.find((p) => p.id === config.marketDataProvider)?.description}
          </div>
        </div>

        {/* Custom API Endpoints */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
            style={{ fontSize: '0.875rem' }}
          >
            {showAdvancedConfig ? '收起' : '显示'}自定义 API 端点
          </button>

          {showAdvancedConfig && (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <div className="form-hint" style={{ marginBottom: 'var(--space-3)' }}>
                如需使用代理或自定义 API，请填写以下端点地址。
              </div>

              <div className="form-group">
                <label className="form-label">基金信息 API</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={DEFAULT_API_ENDPOINTS.fundInfo}
                  value={customEndpoints.fundInfo || ''}
                  onChange={(e) => setCustomEndpoints({ ...customEndpoints, fundInfo: e.target.value || undefined })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">基金净值 API</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={DEFAULT_API_ENDPOINTS.fundNav}
                  value={customEndpoints.fundNav || ''}
                  onChange={(e) => setCustomEndpoints({ ...customEndpoints, fundNav: e.target.value || undefined })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">基金持仓 API</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={DEFAULT_API_ENDPOINTS.fundHoldings}
                  value={customEndpoints.fundHoldings || ''}
                  onChange={(e) => setCustomEndpoints({ ...customEndpoints, fundHoldings: e.target.value || undefined })}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-primary" onClick={handleSaveCustomEndpoints}>
                  保存
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleResetEndpoints}>
                  重置为默认
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LLM Configuration */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">LLM 配置</h2>
        </div>

        <div className="form-group">
          <label className="form-label">LLM 提供商</label>
          <select
            className="form-input form-select"
            value={config.llmProvider}
            onChange={(e) => setLLMProvider(e.target.value)}
          >
            {LLM_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.requiresKey ? '(需配置)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">默认模型</label>
          <select
            className="form-input form-select"
            value={config.llmModel}
            onChange={(e) => setLLMModel(e.target.value)}
          >
            {LLM_PROVIDERS.find((p) => p.id === config.llmProvider)?.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="form-hint">
          用于图片解析和智能分析功能。API Key 可在环境变量中配置。
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">数据管理</h2>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
          <button className="btn btn-primary" onClick={() => handleExport('excel')}>
            📊 导出 Excel
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('json')}>
            📄 导出 JSON
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            📋 导出 CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            📥 导入数据（JSON/CSV/Excel）
          </button>
        </div>

        {(exportStatus || importStatus) && (
          <div className={`badge ${exportStatus ? 'badge-success' : importStatus.includes('失败') ? 'badge-danger' : 'badge-success'}`}>
            {exportStatus || importStatus}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
            <strong>存储信息：</strong>
            <ul style={{ paddingLeft: 'var(--space-4)', margin: 'var(--space-2) 0 0' }}>
              <li>当前资产数量：{assets.length} 笔</li>
              <li>数据存储：浏览器本地 (localStorage)</li>
              <li>数据同步：当前为单机版本，多设备同步在后续版本实现</li>
            </ul>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">关于</h2>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-3)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>版本</span>
            <span>0.1.0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>构建目标</span>
            <span>MVP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>技术栈</span>
            <span>React + TypeScript + Vite</span>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            本应用为家庭资产管理系统 MVP 版本，实现资产录入、资产展示和基金诊断三个核心功能。
            所有数据存储在本地，不会上传到任何服务器。
          </div>
        </div>
      </div>
    </div>
  );
}