import { describe, it, expect } from 'vitest';
import { useAssetStore } from '@/store/assetStore';
import { useFundStore } from '@/store/fundStore';

describe('Asset Store', () => {
  it('should initialize with sample assets', () => {
    const assets = useAssetStore.getState().assets;
    expect(assets.length).toBeGreaterThan(0);
  });

  it('should calculate total assets correctly', () => {
    const totalAssets = useAssetStore.getState().getTotalAssets();
    expect(totalAssets).toBeGreaterThan(0);
  });

  it('should calculate total liabilities correctly', () => {
    const totalLiabilities = useAssetStore.getState().getTotalLiabilities();
    expect(totalLiabilities).toBeGreaterThan(0);
  });

  it('should calculate net assets correctly', () => {
    const netAssets = useAssetStore.getState().getNetAssets();
    const totalAssets = useAssetStore.getState().getTotalAssets();
    const totalLiabilities = useAssetStore.getState().getTotalLiabilities();
    expect(netAssets).toBe(totalAssets - totalLiabilities);
  });

  it('should add a new asset', () => {
    const initialCount = useAssetStore.getState().assets.length;

    useAssetStore.getState().addAsset({
      name: 'Test Asset',
      category: 'liquid',
      subType: '现金类',
      amount: 10000,
      currency: 'CNY',
      tags: ['test'],
      notes: 'Test note',
    });

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
    expect(breakdown).toHaveProperty('financial');
    expect(breakdown).toHaveProperty('protection');
    expect(breakdown).toHaveProperty('liability');
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