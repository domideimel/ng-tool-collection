import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@ng-tool-collection/home').then(m => m.WebsiteComponent),
    title: 'Tool Collection',
  },
  {
    path: 'tools',
    loadChildren: () => import('@ng-tool-collection/tools').then(m => m.toolsRoutes),
    title: 'Tool Collection',
  },
];
