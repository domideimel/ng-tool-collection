import { ApplicationConfig, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideNgxWebstorage, withLocalStorage, withSessionStorage } from 'ngx-webstorage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideNgxWebstorage(withLocalStorage(), withSessionStorage()),
    provideHotToastConfig(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideExperimentalZonelessChangeDetection(),
  ],
};
