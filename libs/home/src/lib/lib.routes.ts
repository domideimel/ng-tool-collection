import { Route } from '@angular/router';
import { CardGridComponent } from './components/card-grid/card-grid.component';

export const homeRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    children: [{
      path: '',
      component: CardGridComponent
    }]
  }
];
