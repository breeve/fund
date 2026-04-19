import { useState, useRef } from 'react';
import { useConfigStore, MARKET_DATA_PROVIDERS, LLM_PROVIDERS } from '@/store';
import { saveAs } from 'file-saver';
import { useAssetStore } from '@/store';
import type { Asset } from '@/types';

export function SettingsPage() {
  const { config, preferences, setTheme, setLocale, setDefaultView, setShowTips } = useConfigStore();
  const { assets, addAsset } = useAssetStore();
  const [exportStatus, setExportStatus] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        const data = JSON.stringify({ assets, exportedAt: new Date().toISOString() }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, `fund-assets-${new Date().toISOString().split('T')[0]}.json`);
      } else {
        // CSV export
        const headers = ['名称', '类别', '子类别', '金额', '货币', '标签', '备注', '创建时间', '更新时间'];
        const rows = assets.map((a) => [
          a.name,
          a.category,
          a.subType,
          a.amount,
          a.currency,
          a.tags.join(';'),
          a.notes,
          a.createdAt,
          a.updatedAt,
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `fund-assets-${new Date().toISOString().split('T')[0]}.csv`);
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
            const asset: Partial<Asset> = {
              name: values[0],
              category: values[1] as Asset['category'],
              subType: values[2] ?? '',
              amount: parseFloat(values[3] ?? '') || 0,
              currency: values[4] || 'CNY',
              tags: values[5] ? values[5].split(';') : [],
              notes: values[6] ?? '',
              createdAt: values[7] || new Date().toISOString(),
              updatedAt: values[8] || new Date().toISOString(),
            };
            if (asset.name && asset.category) {
              importedAssets.push(asset as Asset);
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

      {/* API Configuration */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">数据源配置</h2>
        </div>

        <div className="form-group">
          <label className="form-label">行情数据源</label>
          <select
            className="form-input form-select"
            value={config.marketDataProvider}
            onChange={(e) => {
              // In a real app, this would update the config
              console.log('Provider changed to:', e.target.value);
            }}
          >
            {MARKET_DATA_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.requiresKey ? '(需配置)' : ''}
              </option>
            ))}
          </select>
          <div className="form-hint">
            {MARKET_DATA_PROVIDERS.find((p) => p.id === config.marketDataProvider)?.description}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">LLM 提供商</label>
          <select
            className="form-input form-select"
            value={config.llmProvider}
            onChange={(e) => {
              console.log('LLM changed to:', e.target.value);
            }}
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
            onChange={(e) => {
              // Would call setLLMModel in real app
              console.log('Model changed to:', e.target.value);
            }}
          >
            {LLM_PROVIDERS.find((p) => p.id === config.llmProvider)?.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="card" style={{ backgroundColor: 'var(--color-bg)', marginTop: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <strong>配置说明：</strong>
            <ul style={{ paddingLeft: 'var(--space-4)', margin: 'var(--space-2) 0 0' }}>
              <li>行情数据源：用于获取基金净值和持仓信息</li>
              <li>LLM 提供商：用于图片解析和智能分析功能</li>
              <li>API Key 可在环境变量中配置，或联系管理员</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">数据管理</h2>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
          <button className="btn btn-secondary" onClick={() => handleExport('json')}>
            📥 导出 JSON
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            📥 导出 CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,.csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            📤 导入数据
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