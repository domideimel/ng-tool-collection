import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
  path: '',
  pathMatch: 'full',
  loadChildren: () => import('@ng-tool-collection/home').then(m => m.homeRoutes),
  title: 'Tool Collection'
}, {
  path: 'password-generator',
  loadChildren: () => import('@ng-tool-collection/password-generator').then(m => m.passwordGeneratorRoutes),
  title: 'Passwort Generator'
}, {
  path: 'url-rewrites',
  loadChildren: () => import('@ng-tool-collection/url-rewrites').then(m => m.urlRewritesRoutes),
  title: 'Weiterleitungs-Generator'
}, {
  path: 'builder',
  loadChildren: () => import('@ng-tool-collection/builder').then(m => m.builderRoutes),
  title: 'Builder'
}];
