import { Alert } from '@/components/ui/Alert';

interface RiskFactor {
  type: '垃圾站' | '变电站' | '高架桥' | '墓地' | '工厂' | '加油站';
  name: string;
  distance: number;
  severity: 'low' | 'medium' | 'high';
  description?: string;
}

interface RiskIndicatorProps {
  risks: RiskFactor[];
  communityName?: string;
}

const RISK_CONFIG = {
  low: { label: '低风险', severity: 'normal' as const },
  medium: { label: '中等风险', severity: 'attention' as const },
  high: { label: '高风险', severity: 'warning' as const },
};

function getRiskAction(risk: RiskFactor): { label: string; onClick: () => void } | undefined {
  if (risk.severity === 'high') {
    return { label: '查看详情', onClick: () => console.log('Risk detail:', risk) };
  }
  return undefined;
}

export function RiskIndicator({ risks, communityName }: RiskIndicatorProps) {
  const hasRisks = risks.length > 0;

  if (!hasRisks) {
    return (
      <Alert severity="normal" title="环境评估">
        未检测到不利因素，该小区周边环境安全。
      </Alert>
    );
  }

  const groupedRisks = risks.reduce(
    (acc, risk) => {
      const key = risk.severity;
      if (!acc[key]) acc[key] = [];
      acc[key].push(risk);
      return acc;
    },
    {} as Record<RiskFactor['severity'], RiskFactor[]>,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {communityName && (
        <div
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-gray-700)',
          }}
        >
          {communityName} - 不利因素检测
        </div>
      )}

      {risks.filter((r) => r.severity === 'high').length > 0 && (
        <Alert
          severity="danger"
          title="高风险因素"
          action={getRiskAction(risks.find((r) => r.severity === 'high')!)?.label ? (
            <button
              onClick={() =>
                getRiskAction(risks.find((r) => r.severity === 'high')!)?.onClick()
              }
              style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-danger)',
                fontSize: 'var(--font-size-xs)',
                cursor: 'pointer',
              }}
            >
              {getRiskAction(risks.find((r) => r.severity === 'high')!)?.label}
            </button>
          ) : undefined}
        >
          检测到 {groupedRisks.high?.length || 0} 个高风险因素，请仔细评估。
        </Alert>
      )}

      {risks.filter((r) => r.severity === 'medium').length > 0 && (
        <Alert severity="attention" title="中等风险因素">
          检测到 {groupedRisks.medium?.length || 0} 个中等风险因素，建议关注。
        </Alert>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--spacing-3)',
        }}
      >
        {risks.map((risk, index) => {
          const config = RISK_CONFIG[risk.severity];
          return (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-3)',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${
                  risk.severity === 'high'
                    ? 'var(--color-danger)'
                    : risk.severity === 'medium'
                      ? 'var(--color-warning)'
                      : 'var(--color-gray-300)'
                }`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{risk.name}</span>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: '2px var(--spacing-2)',
                    backgroundColor:
                      risk.severity === 'high'
                        ? '#fee2e2'
                        : risk.severity === 'medium'
                          ? '#fef3c7'
                          : 'var(--color-gray-100)',
                    color:
                      risk.severity === 'high'
                        ? 'var(--color-danger)'
                        : risk.severity === 'medium'
                          ? 'var(--color-warning)'
                          : 'var(--color-gray-600)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {config.label}
                </span>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                类型: {risk.type}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                距离: {risk.distance}m
              </div>
              {risk.description && (
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: 'var(--spacing-1)' }}>
                  {risk.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
