import { Card } from '@/components/ui/Card';

interface DistrictMapProps {
  districtName: string;
  onSelectProperty?: (property: { id: string; name: string }) => void;
}

const SHENZHEN_DISTRICTS = [
  { name: '福田区', code: 'futian', position: { top: '45%', left: '50%' } as const },
  { name: '罗湖区', code: 'luohu', position: { top: '50%', left: '40%' } as const },
  { name: '南山区', code: 'nanshan', position: { top: '58%', left: '55%' } as const },
  { name: '盐田区', code: 'yantian', position: { top: '45%', left: '30%' } as const },
  { name: '宝安区', code: 'baoan', position: { top: '60%', left: '42%' } as const },
  { name: '龙岗区', code: 'longgang', position: { top: '35%', left: '35%' } as const },
  { name: '龙华区', code: 'longhua', position: { top: '48%', left: '55%' } as const },
  { name: '坪山区', code: 'pingshan', position: { top: '28%', left: '50%' } as const },
  { name: '光明区', code: 'guangming', position: { top: '55%', left: '50%' } as const },
];

export function DistrictMap({ districtName, onSelectProperty }: DistrictMapProps) {
  return (
    <Card title={`${districtName || '深圳'}房产地图`}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--color-gray-200)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          <path
            d="M30,40 Q35,35 40,40 Q45,45 50,42 Q55,45 60,50 Q55,55 50,52 Q45,55 40,50 Q35,55 30,50 Q25,45 30,40"
            fill="var(--color-primary-50)"
            stroke="var(--color-primary-200)"
            strokeWidth="0.5"
          />
          <path
            d="M40,48 Q45,45 50,48 Q55,52 52,56 Q48,60 45,56 Q42,52 40,48"
            fill="var(--color-success)"
            fillOpacity="0.2"
            stroke="var(--color-success)"
            strokeWidth="0.5"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-4)',
          }}
        >
          {SHENZHEN_DISTRICTS.map((district) => {
            const isSelected = districtName === district.name;
            return (
              <button
                key={district.code}
                onClick={() => onSelectProperty && onSelectProperty({ id: district.code, name: district.name })}
                style={{
                  position: 'absolute',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  backgroundColor: isSelected ? 'var(--color-primary-600)' : 'white',
                  color: isSelected ? 'white' : 'var(--color-gray-700)',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)',
                  transform: 'translate(-50%, -50%)',
                  top: district.position.top,
                  left: district.position.left,
                }}
              >
                {district.name}
              </button>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 'var(--spacing-4)',
            right: 'var(--spacing-4)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-500)',
          }}
        >
          点击区域查看详情
        </div>
      </div>
    </Card>
  );
}

export function DistrictSelector({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-3)',
        backgroundColor: 'var(--color-gray-50)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {SHENZHEN_DISTRICTS.map((district) => {
        const isSelected = selected === district.code;
        return (
          <button
            key={district.code}
            onClick={() => onSelect(district.code)}
            style={{
              padding: 'var(--spacing-2) var(--spacing-3)',
              backgroundColor: isSelected ? 'var(--color-primary-600)' : 'white',
              color: isSelected ? 'white' : 'var(--color-gray-700)',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {district.name}
          </button>
        );
      })}
    </div>
  );
}
