import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';

interface PoiCategory {
  type: 'metro' | 'school' | 'hospital' | 'mall' | 'park' | 'risk';
  name: string;
  count: number;
  distance: number;
  rating?: number;
}

interface LifeCircleProps {
  name: string;
  anchorStation?: string;
  metroLines?: number;
  poiData?: PoiCategory[];
}

const DEFAULT_POI_DATA: PoiCategory[] = [
  { type: 'metro', name: '地铁', count: 2, distance: 300 },
  { type: 'school', name: '学校', count: 3, distance: 500, rating: 4 },
  { type: 'hospital', name: '医院', count: 1, distance: 800 },
  { type: 'mall', name: '商场', count: 2, distance: 600 },
  { type: 'park', name: '公园', count: 4, distance: 400 },
];

const TYPE_COLORS: Record<PoiCategory['type'], string> = {
  metro: 'var(--color-primary-500)',
  school: 'var(--color-info)',
  hospital: 'var(--color-danger)',
  mall: 'var(--color-warning)',
  park: 'var(--color-success)',
  risk: '#6b7280',
};

export function LifeCircle({ name, anchorStation, metroLines = 1, poiData }: LifeCircleProps) {
  const data = poiData || DEFAULT_POI_DATA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Card title={name}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <div
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>锚定站点</div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{anchorStation || '蛇口线·海上世界'}</div>
          </div>
          <div
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>地铁线路</div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{metroLines} 条线路</div>
          </div>
        </div>
      </Card>

      <Card title="周边配套分析">
        <div style={{ height: '200px' }}>
          <BarChart
            xData={data.map((d) => d.name)}
            yData={data.map((d) => d.count)}
          />
        </div>
      </Card>

      <Card title="配套详情">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {data.map((poi) => (
            <div
              key={poi.type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-3)',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: TYPE_COLORS[poi.type],
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{poi.name}</span>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                {poi.count} 个
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                约 {poi.distance}m
              </div>
              {poi.rating && (
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < poi.rating! ? 'var(--color-warning)' : 'var(--color-gray-300)',
                        fontSize: 'var(--font-size-xs)',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
