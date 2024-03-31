import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
  path: '',
  pathMatch: 'full',
  loadChildren: () => import('@ng-tool-collection/home').then(m => m.HomeModule)
}, {
  path: 'password-generator',
  loadChildren: () => import('@ng-tool-collection/password-generator').then(m => m.PasswordGeneratorModule)
}, {
  path: 'url-rewrites',
  loadChildren: () => import('@ng-tool-collection/url-rewrites').then(m => m.UrlRewritesModule)
}];
