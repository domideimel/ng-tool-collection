import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@ng-tool-collection/tools').then(m => m.toolsRoutes),
    title: 'Tool Collection',
  },
];
