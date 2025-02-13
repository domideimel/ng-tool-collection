import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@total-typescript/ts-reset';

try {
  await bootstrapApplication(AppComponent, appConfig);
} catch (e) {
  console.error(e);
}
