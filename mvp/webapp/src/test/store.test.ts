import { describe, it, expect } from 'vitest';
import { useAssetStore } from '@/store/assetStore';
import { useFundStore } from '@/store/fundStore';
import type { Asset } from '@/types';

describe('Asset Store', () => {
  it('should initialize with sample assets', () => {
    const assets = useAssetStore.getState().assets;
    expect(assets.length).toBeGreaterThan(0);
  });

  it('should calculate total assets correctly', () => {
    const totalAssets = useAssetStore.getState().getTotalAssets();
    expect(totalAssets).toBeGreaterThan(0);
  });

  it('should calculate net assets correctly', () => {
    const netAssets = useAssetStore.getState().getNetAssets();
    const totalAssets = useAssetStore.getState().getTotalAssets();
    expect(netAssets).toBe(totalAssets); // No liabilities in new model
  });

  it('should add a new liquid asset', () => {
    const initialCount = useAssetStore.getState().assets.length;

    useAssetStore.getState().addAsset({
      name: 'Test Asset',
      category: 'liquid',
      subType: '余额宝',
      source: '银行',
      total: 10000,
      tags: ['test'],
      notes: 'Test note',
      entryTime: new Date().toISOString().slice(0, 10),
    } as Asset);

    const newCount = useAssetStore.getState().assets.length;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should get assets by category', () => {
    const liquidAssets = useAssetStore.getState().getAssetsByCategory('liquid');
    liquidAssets.forEach((asset) => {
      expect(asset.category).toBe('liquid');
    });
  });

  it('should filter assets by search term', () => {
    useAssetStore.getState().setFilter({ search: '银行' });
    const filtered = useAssetStore.getState().getFilteredAssets();
    expect(filtered.length).toBeGreaterThan(0);
    useAssetStore.getState().clearFilter();
  });

  it('should get category breakdown', () => {
    const breakdown = useAssetStore.getState().getCategoryBreakdown();
    expect(breakdown).toHaveProperty('liquid');
    expect(breakdown).toHaveProperty('fixed');
    expect(breakdown).toHaveProperty('fund');
    expect(breakdown).toHaveProperty('protection');
  });

  it('should adjust an asset and create new record', () => {
    const assets = useAssetStore.getState().assets;
    const firstAsset = assets[0];
    if (!firstAsset) return; // Skip if no assets

    const initialCount = assets.length;
    const currentTotal = 'total' in firstAsset ? firstAsset.total : 0;

    useAssetStore.getState().adjustAsset(firstAsset.id, {
      total: currentTotal + 1000,
    }, 'Test adjustment');

    const newCount = useAssetStore.getState().assets.length;
    expect(newCount).toBe(initialCount + 1); // New record created
  });
});

describe('Fund Store', () => {
  it('should initialize with empty search results', () => {
    const { searchResults, selectedFund } = useFundStore.getState();
    expect(searchResults).toEqual([]);
    expect(selectedFund).toBeNull();
  });

  it('should search funds by keyword', async () => {
    await useFundStore.getState().searchFunds('沪深');
    const { searchResults } = useFundStore.getState();

    // Wait for search to complete
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('should select and load fund details', async () => {
    await useFundStore.getState().selectFund('000961');

    // Wait for data to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { selectedFund } = useFundStore.getState();
    expect(selectedFund).not.toBeNull();
    expect(selectedFund?.fundInfo.code).toBe('000961');
  });

  it('should clear selection', () => {
    useFundStore.getState().clearSelection();
    expect(useFundStore.getState().selectedFund).toBeNull();
  });

  it('should clear errors', () => {
    useFundStore.getState().clearError();
    expect(useFundStore.getState().error).toBeNull();
  });
});
