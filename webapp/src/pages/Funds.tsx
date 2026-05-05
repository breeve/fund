import { useState } from 'react';
import { FundSearch } from '@/components/fund/FundSearch';
import { FundDetail } from '@/components/fund/FundDetail';
import { FundHoldings } from '@/components/fund/FundHoldings';
import { useFundStore } from '@/store/fundStore';

export default function Funds() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const { holdings } = useFundStore();

  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>基金诊断</h1>

      <FundSearch onSelect={(code) => setSelectedCode(code)} />

      {selectedCode && (
        <>
          <FundDetail code={selectedCode} />
          <FundHoldings holdings={holdings} />
        </>
      )}
    </div>
  );
}