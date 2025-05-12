
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8138238d67d545daa21b0c856b3347af',
  appName: 'goods-tracker-android-app',
  webDir: 'dist',
  server: {
    url: 'https://8138238d-67d5-45da-a21b-0c856b3347af.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: 'apksigner'
    }
  }
};

export default config;
