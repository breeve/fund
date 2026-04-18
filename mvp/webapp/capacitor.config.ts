import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fund.app',
  appName: 'Fund',
  webDir: 'dist',
  // Electron for macOS/Windows desktop
  plugins: {
    // CapacitorElectron-specific config if needed
  }
};

export default config;
