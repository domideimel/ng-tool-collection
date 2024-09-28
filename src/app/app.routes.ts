import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@ng-tool-collection/home').then(m => m.CardGridComponent),
    title: 'Tool Collection',
  },
  {
    path: 'password-generator',
    loadComponent: () => import('@ng-tool-collection/password-generator').then(m => m.GeneratorWrapperComponent),
    title: 'Passwort Generator',
  },
  {
    path: 'url-rewrites',
    loadComponent: () => import('@ng-tool-collection/url-rewrites').then(m => m.UrlRewritesComponent),
    title: 'Weiterleitungs-Generator',
  },
];
