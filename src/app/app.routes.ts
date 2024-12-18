import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@ng-tool-collection/home').then(m => m.CardGridComponent),
    title: 'Tool Collection',
  },
  {
    path: 'tools',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadChildren: () => import('@ng-tool-collection/tools').then(m => m.toolsRoutes),
    title: 'Tool Collection',
  },
];
