import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fundService } from '@/services/fundService';
import type { FundSearchResult } from '@/types/fund';

interface FundSearchProps {
  onSelect: (code: string) => void;
}

export function FundSearch({ onSelect }: FundSearchProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<FundSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await fundService.search(keyword);
      setResults(data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="搜索基金">
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入基金代码或名称"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? '搜索中...' : '搜索'}
        </Button>
      </div>

      {searched && results.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-gray-500)' }}>
          未找到匹配的基金
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {results.map((fund) => (
            <div
              key={fund.code}
              onClick={() => onSelect(fund.code)}
              style={{
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
              <div>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{fund.name}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{fund.code}</div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>{fund.type}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}