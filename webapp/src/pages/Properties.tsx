import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BlockList } from '@/components/property/BlockList';
import { CommunityDetail } from '@/components/property/CommunityDetail';
import { DistrictMap, DistrictSelector } from '@/components/property/DistrictMap';
import { LifeCircle } from '@/components/property/LifeCircle';
import { RiskIndicator } from '@/components/property/RiskIndicator';
import { usePropertyStore } from '@/store/propertyStore';
import type { BlockInfo } from '@/types/property';

const MOCK_RISKS = [
  { type: '垃圾站' as const, name: '南山区垃圾中转站', distance: 320, severity: 'low' as const },
  { type: '变电站' as const, name: '科技园变电站', distance: 450, severity: 'medium' as const },
  { type: '高架桥' as const, name: '北环大道', distance: 800, severity: 'low' as const },
];

export default function Properties() {
  const [selectedBlock, setSelectedBlock] = useState<BlockInfo | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('futian');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const { selectedCommunity, communities } = usePropertyStore();

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>深圳房产分析</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button
            onClick={() => setViewMode('map')}
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'map' ? 'var(--color-primary-600)' : 'var(--color-gray-100)',
              color: viewMode === 'map' ? 'white' : 'var(--color-gray-700)',
            }}
          >
            地图模式
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'list' ? 'var(--color-primary-600)' : 'var(--color-gray-100)',
              color: viewMode === 'list' ? 'white' : 'var(--color-gray-700)',
            }}
          >
            列表模式
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <DistrictMap districtName="福田区" />
      ) : (
        <DistrictSelector selected={selectedDistrict} onSelect={setSelectedDistrict} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <BlockList district={selectedDistrict} onSelect={setSelectedBlock} />

        {selectedBlock ? (
          <Card title={`${selectedBlock.name} - 小区列表`}>
            {communities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {communities.map((community) => (
                  <div
                    key={community.code}
                    style={{
                      padding: 'var(--spacing-3)',
                      border: '1px solid var(--color-gray-200)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-gray-200)';
                    }}
                  >
                    <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{community.name}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                      均价: ¥{community.avgPrice.toLocaleString()}/㎡ | {community.buildingCount}栋 | {community.unitCount}户
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-gray-500)' }}>
                点击板块查看小区列表
              </div>
            )}
          </Card>
        ) : (
          <LifeCircle name="生活圈分析" />
        )}
      </div>

      {selectedCommunity && <CommunityDetail community={selectedCommunity} onClose={() => {}} />}

      <Card title="不利因素检测">
        <RiskIndicator risks={MOCK_RISKS} communityName="示例小区" />
      </Card>
    </div>
  );
}