import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { CATEGORY_LABELS, type Asset, type AssetCategory } from '@/types/asset';

interface AssetListProps {
  assets: Asset[];
  loading?: boolean;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

export function AssetList({ assets, loading = false, onEdit, onDelete }: AssetListProps) {
  const columns = [
    {
      key: 'name',
      title: '名称',
      render: (_: unknown, row: Asset) => (
        <div>
          <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{row.name}</div>
          {row.subCategory && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
              {row.subCategory}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      title: '类别',
      render: (_: unknown, row: Asset) => (
        <span
          style={{
            display: 'inline-block',
            padding: 'var(--spacing-1) var(--spacing-2)',
            backgroundColor: 'var(--color-primary-50)',
            color: 'var(--color-primary-600)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-xs)',
          }}
        >
          {CATEGORY_LABELS[row.category as AssetCategory]}
        </span>
      ),
    },
    {
      key: 'amount',
      title: '金额',
      render: (v: unknown) => (
        <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
          ¥{Number(v).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'tags',
      title: '标签',
      render: (v: unknown) => {
        const tags = v as string[] | undefined;
        if (!tags || tags.length === 0) return <span style={{ color: 'var(--color-gray-400)' }}>-</span>;
        return (
          <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px var(--spacing-2)',
                  backgroundColor: 'var(--color-gray-100)',
                  borderRadius: 'var(---radius-sm)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-600)',
                }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                +{tags.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: Asset) => (
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
              编辑
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(row)}>
              删除
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-gray-500)' }}>
        加载中...
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-8)',
          color: 'var(--color-gray-500)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        暂无资产数据
      </div>
    );
  }

  return <Table columns={columns} data={assets} />;
}
