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

  // Preferences actions
  setTheme: (theme: UserPreferences['theme']) => void;
  setLocale: (locale: string) => void;
  setDefaultView: (view: UserPreferences['defaultView']) => void;
  setShowTips: (show: boolean) => void;
  resetConfig: () => void;
}

const defaultConfig: AppConfig = {
  marketDataProvider: 'eastmoney', // 东方财富作为默认免费数据源
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
    description: '国内知名财经网站，部分免费接口',
    requiresKey: false,
  },
  {
    id: 'tushare',
    name: 'Tushare Pro',
    description: '专业金融数据平台，需付费订阅',
    requiresKey: true,
  },
  {
    id: 'akshare',
    name: 'AKShare',
    description: '免费开源财经数据包',
    requiresKey: false,
  },
  {
    id: 'yahoo',
    name: 'Yahoo Finance',
    description: '美股/港股数据，免费',
    requiresKey: false,
  },
  {
    id: 'custom',
    name: '自定义',
    description: '配置自定义 API 地址',
    requiresKey: true,
  },
];

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