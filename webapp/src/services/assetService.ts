import apiClient from './api';
import type { Asset, AssetFormData, AssetSummary } from '@/types/asset';

export const assetService = {
  async list(): Promise<Asset[]> {
    return apiClient.get('/assets');
  },

  async get(id: string): Promise<Asset> {
    return apiClient.get(`/assets/${id}`);
  },

  async create(data: AssetFormData): Promise<Asset> {
    return apiClient.post('/assets', data);
  },

  async update(id: string, data: AssetFormData): Promise<Asset> {
    return apiClient.put(`/assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/assets/${id}`);
  },

  async batchImport(formData: FormData): Promise<Asset[]> {
    return apiClient.post('/assets/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async getSummary(): Promise<AssetSummary> {
    return apiClient.get('/assets/summary');
  },
};
