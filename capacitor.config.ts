import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.aquatracker',
  appName: 'AquaTracker',
  webDir: 'out',
  server : {
    url: 'https://aquatracker.in',
    cleartext: true
  }
};

export default config;
