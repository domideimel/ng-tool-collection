import { Route } from '@angular/router';

export const toolsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./tools/tools.component').then(m => m.ToolsComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./card-grid/card-grid.component').then(m => m.CardGridComponent),
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
      {
        path: 'currency-converter',
        loadComponent: () => import('@ng-tool-collection/currency-converter').then(m => m.CurrencyConverterComponent),
        title: 'Währungs-Umrechner',
      },
    ],
  },
];
