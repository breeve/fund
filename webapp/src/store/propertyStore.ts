import { create } from 'zustand';
import type { Property, BlockInfo, CommunityInfo } from '@/types/property';
import { propertyService } from '@/services/propertyService';

interface PropertyState {
  districts: BlockInfo[];
  selectedBlock: BlockInfo | null;
  communities: CommunityInfo[];
  selectedCommunity: CommunityInfo | null;
  properties: Property[];
  loading: boolean;
  fetchDistricts: (district: string) => Promise<void>;
  fetchCommunities: (blockCode: string) => Promise<void>;
  fetchCommunityProperties: (communityCode: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  districts: [],
  selectedBlock: null,
  communities: [],
  selectedCommunity: null,
  properties: [],
  loading: false,

  fetchDistricts: async (district: string) => {
    set({ loading: true });
    try {
      const data = await propertyService.getDistrictBlocks(district);
      set({ districts: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  fetchCommunities: async (blockCode: string) => {
    set({ loading: true });
    try {
      const data = await propertyService.getBlockCommunities(blockCode);
      set({ communities: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  fetchCommunityProperties: async (communityCode: string) => {
    set({ loading: true });
    try {
      const data = await propertyService.getCommunityDetail(communityCode);
      set({ properties: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },
}));