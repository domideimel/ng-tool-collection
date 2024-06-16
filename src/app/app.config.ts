import { ApplicationConfig, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideNgxWebstorage, withLocalStorage, withSessionStorage } from 'ngx-webstorage';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideNgxWebstorage(
      withLocalStorage(),
      withSessionStorage()
    ),
    provideHotToastConfig(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideExperimentalZonelessChangeDetection()
  ]
};
