import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Tool Collection',
    redirectTo: 'tools',
  },
  {
    path: 'tools',
    loadChildren: () => import('@ng-tool-collection/tools').then(m => m.toolsRoutes),
    title: 'Tool Collection',
  },
];
