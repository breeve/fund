import apiClient from './api';
import type { Fund, FundNavHistory, FundHolding, FundAnalysis } from '@/types/fund';

export const fundService = {
  async search(keyword: string): Promise<Fund[]> {
    return apiClient.get('/funds/search', { params: { keyword } });
  },

  async getInfo(code: string): Promise<Fund> {
    return apiClient.get(`/funds/${code}`);
  },

  async getNavHistory(code: string): Promise<FundNavHistory[]> {
    return apiClient.get(`/funds/${code}/nav`);
  },

  async getHoldings(code: string): Promise<FundHolding[]> {
    return apiClient.get(`/funds/${code}/holdings`);
  },

  async getAnalysis(code: string): Promise<FundAnalysis> {
    return apiClient.get(`/funds/${code}/analysis`);
  },

  async simulate(fundCodes: string[], allocation: number[]): Promise<{ expectedReturn: number; volatility: number }> {
    return apiClient.post('/funds/simulate', { fundCodes, allocation });
  },
};
