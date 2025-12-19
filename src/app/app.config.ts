import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import { GlobalErrorHandler } from '@ng-tool-collection/utils';

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{rose.50}',
      100: '{rose.100}',
      200: '{rose.200}',
      300: '{rose.300}',
      400: '{rose.400}',
      500: '{rose.500}',
      600: '{rose.600}',
      700: '{rose.700}',
      800: '{rose.800}',
      900: '{rose.900}',
      950: '{rose.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
      },
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
