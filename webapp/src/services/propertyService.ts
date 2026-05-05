import apiClient from './api';
import type { Property, BlockInfo, CommunityInfo, PropertyPriceHistory } from '@/types/property';

export const propertyService = {
  async getDistrictBlocks(district: string): Promise<BlockInfo[]> {
    return apiClient.get('/properties/districts', { params: { district } });
  },

  async getBlockCommunities(blockCode: string): Promise<CommunityInfo[]> {
    return apiClient.get('/properties/communities', { params: { block: blockCode } });
  },

  async getCommunityDetail(communityCode: string): Promise<Property[]> {
    return apiClient.get(`/properties/communities/${communityCode}`);
  },

  async getPriceHistory(propertyId: string): Promise<PropertyPriceHistory[]> {
    return apiClient.get(`/properties/${propertyId}/price-history`);
  },

  async search(keyword: string): Promise<Property[]> {
    return apiClient.get('/properties/search', { params: { keyword } });
  },

  async getSimilar(communityCode: string): Promise<Property[]> {
    return apiClient.get(`/properties/communities/${communityCode}/similar`);
  },
};