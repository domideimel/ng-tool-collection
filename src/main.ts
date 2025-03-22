import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@total-typescript/ts-reset';
import { inject } from '@vercel/analytics';

try {
  await bootstrapApplication(AppComponent, appConfig);
  inject();
} catch (e) {
  console.error(e);
}
