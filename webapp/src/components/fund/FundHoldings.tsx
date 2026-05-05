import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import type { FundHolding } from '@/types/fund';

interface FundHoldingsProps {
  holdings: FundHolding[];
}

export function FundHoldings({ holdings }: FundHoldingsProps) {
  const columns = [
    { key: 'rank', title: '排名', render: (_: unknown, row: FundHolding) => `#${row.rank}` },
    { key: 'code', title: '股票代码' },
    { key: 'name', title: '股票名称' },
    { key: 'ratio', title: '占比', render: (v: unknown) => `${Number(v).toFixed(2)}%` },
    { key: 'shares', title: '持股数量', render: (v: unknown) => Number(v).toLocaleString() },
  ];

  return (
    <Card title="持仓明细">
      {holdings.length > 0 ? (
        <Table columns={columns} data={holdings} />
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-gray-500)' }}>暂无持仓数据</div>
      )}
    </Card>
  );
}