import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@total-typescript/ts-reset';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

try {
  await bootstrapApplication(AppComponent, appConfig);
  injectSpeedInsights();
  inject({
    beforeSend: event => {
      if (localStorage.getItem('va-disable') === 'true') {
        return null;
      }
      return event;
    },
  });
} catch (e) {
  console.error(e);
}
