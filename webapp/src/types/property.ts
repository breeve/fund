export type PropertyCategory = 'residential' | 'commercial' | 'office' | 'industrial';

export interface Property {
  id: string;
  name: string;
  category: PropertyCategory;
  district: string;
  block: string;
  address: string;
  area: number;
  price: number;
  unitPrice: number;
  yearBuilt: number;
  floor: number;
  orientation: string;
  structure: string;
}

export interface PropertyPriceHistory {
  date: string;
  price: number;
  unitPrice: number;
}

export interface BlockInfo {
  code: string;
  name: string;
  district: string;
  avgPrice: number;
  transactionVolume: number;
}

export interface CommunityInfo {
  code: string;
  name: string;
  block: string;
  avgPrice: number;
  buildingCount: number;
  unitCount: number;
  yearBuilt: number;
  propertyType: string;
}

export const PROPERTY_CATEGORY_LABELS: Record<PropertyCategory, string> = {
  residential: '住宅',
  commercial: '商业',
  office: '办公',
  industrial: '工业',
};