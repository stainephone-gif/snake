import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neonsnake.game',
  appName: 'Neon Snake',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    minWebViewVersion: 55,
    backgroundColor: '#0a0e27'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0e27',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      spinnerColor: '#00f3ff'
    }
  }
};

export default config;
