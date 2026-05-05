import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AssetForm } from '@/components/asset/AssetForm';
import { AssetList } from '@/components/asset/AssetList';
import { AssetSummary } from '@/components/asset/AssetSummary';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { useAssetStore } from '@/store/assetStore';
import { CATEGORY_LABELS, type AssetCategory } from '@/types/asset';
import type { Asset } from '@/types/asset';

export default function Assets() {
  const { assets, summary, loading, fetchAssets, fetchSummary, createAsset } = useAssetStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetchAssets();
    fetchSummary();
  }, [fetchAssets, fetchSummary]);

  const handleCreateAsset = async (data: { category: AssetCategory; name: string; amount: number }) => {
    await createAsset(data);
    setShowAddModal(false);
    fetchAssets();
    fetchSummary();
  };

  const handleDeleteAsset = async (asset: Asset) => {
    if (window.confirm(`确定要删除资产 "${asset.name}" 吗？`)) {
      await useAssetStore.getState().deleteAsset(asset.id);
      fetchAssets();
      fetchSummary();
    }
  };

  const pieData = summary
    ? Object.entries(summary.categoryBreakdown).map(([key, value]) => ({
        name: CATEGORY_LABELS[key as AssetCategory],
        value,
      }))
    : [];

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>资产总览</h1>
        <Button onClick={() => setShowAddModal(true)}>+ 添加资产</Button>
      </div>

      {summary && (
        <AssetSummary
          totalAssets={summary.totalAssets}
          totalLiabilities={summary.totalLiabilities}
          netAssets={summary.netAssets}
          categoryBreakdown={summary.categoryBreakdown}
          periodChange={5.2}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card title="资产构成">
          {pieData.length > 0 ? <PieChart data={pieData} /> : <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-gray-500)' }}>暂无数据</div>}
        </Card>
        <Card title="资产分类统计">
          {pieData.length > 0 ? <BarChart xData={pieData.map(d => d.name)} yData={pieData.map(d => d.value)} /> : <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-gray-500)' }}>暂无数据</div>}
        </Card>
      </div>

      <Card title="资产明细">
        <AssetList
          assets={assets}
          loading={loading}
          onEdit={setSelectedAsset}
          onDelete={handleDeleteAsset}
        />
      </Card>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="添加资产">
        <AssetForm onSubmit={handleCreateAsset} />
      </Modal>

      {selectedAsset && (
        <Modal open={!!selectedAsset} onClose={() => setSelectedAsset(null)} title="编辑资产">
          <AssetForm asset={selectedAsset} onSubmit={async (data) => {
            await useAssetStore.getState().updateAsset(selectedAsset!.id, data);
            setSelectedAsset(null);
            fetchAssets();
          }} />
        </Modal>
      )}
    </div>
  );
}
