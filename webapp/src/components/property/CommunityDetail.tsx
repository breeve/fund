import { Card } from '@/components/ui/Card';
import type { CommunityInfo } from '@/types/property';

interface CommunityDetailProps {
  community: CommunityInfo;
  onClose: () => void;
}

export function CommunityDetail({ community }: CommunityDetailProps) {
  const info = [
    { label: '小区名称', value: community.name },
    { label: '板块', value: community.block },
    { label: '建筑年代', value: community.yearBuilt },
    { label: '建筑类型', value: community.propertyType },
    { label: '楼栋数量', value: `${community.buildingCount} 栋` },
    { label: '单元数量', value: `${community.unitCount} 户` },
    { label: '参考均价', value: `¥${community.avgPrice.toLocaleString()}/㎡` },
  ];

  return (
    <Card title={community.name}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        {info.map((item) => (
          <div key={item.label} style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-1)' }}>{item.label}</div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}