import { Route } from '@angular/router';
import { PasswordGeneratorComponent } from './components/password-generator.component';

export const passwordGeneratorRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: PasswordGeneratorComponent }
];
