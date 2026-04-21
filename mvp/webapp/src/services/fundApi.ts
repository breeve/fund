/**
 * Fund API Service - EastMoney Integration
 * Provides real fund data from EastMoney APIs
 *
 * Endpoints:
 * - fundInfo: https://fundgz.1234567.com.cn/js/{code}.js (JSONP)
 * - fundNav: https://push2his.eastmoney.com/api/qt/stock/kline/get
 * - fundHoldings: https://fundf10.eastmoney.com/FundArchives/Net.aspx
 */

import type { FundInfo, FundNAV, FundHolding } from '@/types';
import { useConfigStore, DEFAULT_API_ENDPOINTS } from '@/store/configStore';

// EastMoney fund info response (gzipped JSONP)
interface FundGZResponse {
  success: string;
  name: string;
  jzrq: string; // NAV date
  dwjz: string; // NAV
  gsz: string; // estimated NAV
  gszzl: string; // daily change %
  gztime: string; // update time
}

// EastMoney NAV history response
interface EastMoneyNAVResponse {
  data: {
    klines: string[]; // Kline data as strings separated by commas
  };
  success: string;
}

// Cache for API responses
const navCache = new Map<string, { data: FundNAV[]; timestamp: number }>();
const infoCache = new Map<string, { data: FundInfo; timestamp: number }>();
const holdingsCache = new Map<string, { data: FundHolding[]; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(cache: Map<string, { data: T; timestamp: number }>, key: string, ttl: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
}

function setCache<T>(cache: Map<string, { data: T; timestamp: number }>, key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Get custom API endpoints from config, fallback to defaults
 */
function getApiEndpoints() {
  const config = useConfigStore.getState().config;
  return {
    fundInfo: config.customApiEndpoints?.fundInfo || DEFAULT_API_ENDPOINTS.fundInfo,
    fundNav: config.customApiEndpoints?.fundNav || DEFAULT_API_ENDPOINTS.fundNav,
    fundHoldings: config.customApiEndpoints?.fundHoldings || DEFAULT_API_ENDPOINTS.fundHoldings,
  };
}

/**
 * Search funds by keyword (fund code or name)
 * Uses fundgz API to verify if a fund code exists
 */
export async function searchFunds(keyword: string): Promise<FundInfo[]> {
  if (!keyword.trim()) {
    return [];
  }

  // Clean the keyword - remove spaces, pad to 6 digits if it's a number
  const cleaned = keyword.trim().replace(/\s/g, '');

  // Check if it looks like a fund code (6 digits)
  if (/^\d{6}$/.test(cleaned)) {
    // Try to get fund info directly by code
    const fund = await getFundInfo(cleaned);
    if (fund) {
      return [fund];
    }
  }

  // If not a pure code, search by trying to match fund names
  // Since EastMoney search API is unreliable, we return empty
  // The user should enter the exact fund code
  return [];
}

/**
 * Get fund basic info by code
 */
export async function getFundInfo(code: string): Promise<FundInfo | null> {
  // Check cache first
  const cached = getCached(infoCache, code, CACHE_TTL);
  if (cached) return cached;

  const endpoints = getApiEndpoints();

  try {
    // Use fundgz API - returns JSONP format
    // Replace {code} placeholder in endpoint URL
    const url = endpoints.fundInfo.replace('{code}', code);
    const response = await fetch(`${url}?rt=${Date.now()}`, {
      headers: {
        'Accept': '*/*',
        'Referer': 'https://fund.eastmoney.com',
      },
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    // Parse JSONP response: callback({"success":true,...})
    const match = text.match(/callback\((.*)\)/);
    if (!match || !match[1]) {
      return null;
    }

    const data: FundGZResponse = JSON.parse(match[1]);

    if (data.success === 'true') {
      const fundInfo: FundInfo = {
        code: code,
        name: data.name || '',
        type: '', // Not provided by this API
        company: '', // Not provided by this API
        launchDate: '', // Not provided by this API
        riskLevel: 3, // Default
      };

      setCache(infoCache, code, fundInfo);
      return fundInfo;
    }

    return null;
  } catch (error) {
    console.error('Get fund info error:', error);
    return null;
  }
}

/**
 * Get fund NAV history
 */
export async function getFundNAV(code: string): Promise<FundNAV[]> {
  // Check cache first
  const cached = getCached(navCache, code, CACHE_TTL);
  if (cached) return cached;

  const endpoints = getApiEndpoints();

  try {
    // Use push2his API for historical NAV data
    const params = new URLSearchParams({
      secid: `1.${code}`, // 1 = Shanghai, 0 = Shenzhen
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      fields1: 'f1,f2,f3,f4,f5,f6',
      fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
      klt: '101', // Daily K-line
      fqt: '1', // Adjusted NAV
      beg: '0', // Beginning date (0 = all available)
      end: '20500101', // End date
      smplmt: '460', // Limit results
      lmt: '0',
    });

    const response = await fetch(`${endpoints.fundNav}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://fund.eastmoney.com',
      },
    });

    if (!response.ok) {
      throw new Error(`NAV API failed: ${response.status}`);
    }

    const data: EastMoneyNAVResponse = await response.json();

    if (data.data?.klines && Array.isArray(data.data.klines)) {
      const navHistory: FundNAV[] = data.data.klines.map((kline) => {
        const parts = kline.split(',');
        return {
          date: parts[0] ?? '',
          nav: parseFloat(parts[1] ?? '') || 0,
          accNav: parseFloat(parts[2] ?? '') || 0,
          changePct: parseFloat(parts[6] ?? '') || 0,
        };
      });

      setCache(navCache, code, navHistory);
      return navHistory;
    }

    return [];
  } catch (error) {
    console.error('Get fund NAV error:', error);
    return [];
  }
}

/**
 * Get fund top 10 holdings
 * Note: Holdings data is only available quarterly from funds' reports
 */
export async function getFundHoldings(code: string): Promise<FundHolding[]> {
  // Check cache first
  const cached = getCached(holdingsCache, code, CACHE_TTL);
  if (cached) return cached;

  const endpoints = getApiEndpoints();

  try {
    // Use fundf10 API for holdings data
    const response = await fetch(`${endpoints.fundHoldings}?type=jjcc&code=${code}&topline=10`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Referer': 'https://fund.eastmoney.com',
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    // Parse HTML to extract holdings
    const holdings = parseHoldingsFromHtml(html);

    if (holdings.length > 0) {
      setCache(holdingsCache, code, holdings);
    }

    return holdings;
  } catch (error) {
    console.error('Get fund holdings error:', error);
    return [];
  }
}

interface HoldingItem {
  SECUNAME?: string;
  SECUCODE?: string;
  PROPORTION?: string;
  INDUSTRY?: string;
}

/**
 * Parse holdings data from EastMoney HTML response
 */
function parseHoldingsFromHtml(html: string): FundHolding[] {
  const holdings: FundHolding[] = [];

  // Look for JSON data in script tags
  const scriptPattern = /var\s+jjcc\s*=\s*(\{.*?\});/s;
  const scriptMatch = scriptPattern.exec(html);

  if (scriptMatch && scriptMatch[1]) {
    try {
      const rawData = scriptMatch[1];
      const dataMatch = rawData.match(/\[.*\]/s);
      if (dataMatch && dataMatch[0]) {
        const holdingsData: HoldingItem[] = JSON.parse(dataMatch[0]);
        if (Array.isArray(holdingsData)) {
          for (let i = 0; i < Math.min(10, holdingsData.length); i++) {
            const item = holdingsData[i];
            if (item?.SECUNAME) {
              holdings.push({
                rank: i + 1,
                name: item.SECUNAME,
                code: item.SECUCODE || '',
                proportion: item.PROPORTION ? parseFloat(item.PROPORTION) || 0 : 0,
                industry: item.INDUSTRY || '',
              });
            }
          }
        }
      }
    } catch {
      // JSON parse failed, try HTML parsing
    }
  }

  // Fallback: parse HTML table rows
  if (holdings.length === 0) {
    const rowPattern = /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([\d.]+)<\/td>/g;

    let match;
    let rank = 1;
    while ((match = rowPattern.exec(html)) !== null && rank <= 10) {
      const code = match[1] || '';
      const name = (match[2] || '').trim();
      const industry = (match[3] || '').trim();
      const proportion = parseFloat(match[4] || '0');

      if (name && !isNaN(proportion)) {
        holdings.push({
          rank,
          name,
          code,
          proportion,
          industry,
        });
        rank++;
      }
    }
  }

  return holdings;
}
