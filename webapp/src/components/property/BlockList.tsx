import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { usePropertyStore } from '@/store/propertyStore';
import type { BlockInfo } from '@/types/property';

interface BlockListProps {
  district: string;
  onSelect: (block: BlockInfo) => void;
}

const SHENZHEN_DISTRICTS = [
  { value: 'futian', label: '福田区' },
  { value: 'nanshan', label: '南山区' },
  { value: 'yantian', label: '盐田区' },
  { value: 'baoan', label: '宝安区' },
  { value: 'longgang', label: '龙岗区' },
  { value: 'longhua', label: '龙华区' },
  { value: 'pingshan', label: '坪山区' },
  { value: 'guangming', label: '光明区' },
  { value: 'dapeng', label: '大鹏新区' },
];

export function BlockList({ district, onSelect }: BlockListProps) {
  const { districts, loading, fetchDistricts } = usePropertyStore();
  const [selectedDistrict, setSelectedDistrict] = useState(district || 'futian');

  useEffect(() => {
    fetchDistricts(selectedDistrict);
  }, [selectedDistrict, fetchDistricts]);

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
  };

  return (
    <Card title="深圳区域-板块分析">
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <Select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={SHENZHEN_DISTRICTS}
          style={{ width: '200px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>加载中...</div>
      ) : districts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)' }}>
          {districts.map((block) => (
            <div
              key={block.code}
              onClick={() => onSelect(block)}
              style={{
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gray-200)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-1)' }}>{block.name}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                均价: ¥{block.avgPrice.toLocaleString()}/㎡ | 成交量: {block.transactionVolume}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-gray-500)' }}>暂无数据</div>
      )}
    </Card>
  );
}