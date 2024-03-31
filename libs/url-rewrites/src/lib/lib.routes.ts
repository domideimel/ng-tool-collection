import { Route } from '@angular/router';
import { UrlRewritesComponent } from './components/url-rewrites.component';

export const urlRewritesRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: UrlRewritesComponent }
];
