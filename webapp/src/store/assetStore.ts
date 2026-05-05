import { create } from 'zustand';
import type { Asset, AssetSummary } from '@/types/asset';
import { assetService } from '@/services/assetService';

interface AssetState {
  assets: Asset[];
  summary: AssetSummary | null;
  loading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  createAsset: (data: Parameters<typeof assetService.create>[0]) => Promise<void>;
  updateAsset: (id: string, data: Parameters<typeof assetService.update>[1]) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  summary: null,
  loading: false,
  error: null,

  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const assets = await assetService.list();
      set({ assets, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchSummary: async () => {
    const summary = await assetService.getSummary();
    set({ summary });
  },

  createAsset: async (data) => {
    await assetService.create(data);
  },

  updateAsset: async (id, data) => {
    await assetService.update(id, data);
  },

  deleteAsset: async (id) => {
    await assetService.delete(id);
  },
}));
