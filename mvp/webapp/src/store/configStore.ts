import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppConfig, UserPreferences } from '@/types';

interface ConfigState {
  config: AppConfig;
  preferences: UserPreferences;

  // Config actions
  setMarketDataProvider: (provider: string) => void;
  setLLMProvider: (provider: string) => void;
  setLLMModel: (model: string) => void;
  setCustomApiEndpoints: (endpoints: AppConfig['customApiEndpoints']) => void;

  // Preferences actions
  setTheme: (theme: UserPreferences['theme']) => void;
  setLocale: (locale: string) => void;
  setDefaultView: (view: UserPreferences['defaultView']) => void;
  setShowTips: (show: boolean) => void;
  resetConfig: () => void;
}

const defaultConfig: AppConfig = {
  marketDataProvider: 'eastmoney',
  llmProvider: 'openai',
  llmModel: 'gpt-4o-mini',
  theme: 'light',
  locale: 'zh-CN',
  dataDir: './data',
};

const defaultPreferences: UserPreferences = {
  theme: 'light',
  locale: 'zh-CN',
  defaultView: 'overview',
  dateFormat: 'YYYY-MM-DD',
  currency: 'CNY',
  showTips: true,
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      preferences: defaultPreferences,

      setMarketDataProvider: (provider) => {
        set((state) => ({
          config: { ...state.config, marketDataProvider: provider },
        }));
      },

      setLLMProvider: (provider) => {
        set((state) => ({
          config: { ...state.config, llmProvider: provider },
        }));
      },

      setLLMModel: (model) => {
        set((state) => ({
          config: { ...state.config, llmModel: model },
        }));
      },

      setCustomApiEndpoints: (endpoints) => {
        set((state) => ({
          config: { ...state.config, customApiEndpoints: endpoints },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          preferences: { ...state.preferences, theme },
          config: { ...state.config, theme },
        }));
      },

      setLocale: (locale) => {
        set((state) => ({
          preferences: { ...state.preferences, locale },
          config: { ...state.config, locale },
        }));
      },

      setDefaultView: (view) => {
        set((state) => ({
          preferences: { ...state.preferences, defaultView: view },
        }));
      },

      setShowTips: (show) => {
        set((state) => ({
          preferences: { ...state.preferences, showTips: show },
        }));
      },

      resetConfig: () => {
        set({ config: defaultConfig, preferences: defaultPreferences });
      },
    }),
    {
      name: 'fund-manager-config',
      version: 1,
    }
  )
);

// Market data providers configuration
export const MARKET_DATA_PROVIDERS = [
  {
    id: 'eastmoney',
    name: '东方财富',
    description: '国内知名财经网站，免费接口',
    requiresKey: false,
    endpoints: {
      fundSearch: 'https://fund.eastmoney.com/ajax/ranking/',
      fundInfo: 'https://fundgz.1234567.com.cn/js/{code}.js',
      fundNav: 'https://push2his.eastmoney.com/api/qt/stock/kline/get',
      fundHoldings: 'https://fundf10.eastmoney.com/FundArchives/Net.aspx',
    },
  },
];

// Default API endpoints (EastMoney)
export const DEFAULT_API_ENDPOINTS = {
  fundSearch: 'https://fund.eastmoney.com/ajax/ranking/',
  fundInfo: 'https://fundgz.1234567.com.cn/js/{code}.js',
  fundNav: 'https://push2his.eastmoney.com/api/qt/stock/kline/get',
  fundHoldings: 'https://fundf10.eastmoney.com/FundArchives/Net.aspx',
};

// LLM providers configuration
export const LLM_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresKey: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'],
    requiresKey: true,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    requiresKey: true,
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    models: ['llama3', 'qwen2', 'codellama'],
    requiresKey: false,
    baseUrl: 'http://localhost:11434',
  },
  {
    id: 'groq',
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
    requiresKey: true,
  },
];