import { Route } from '@angular/router';
import { GeneratorFormComponent } from './components/generator-form/generator-form.component';

export const passwordGeneratorRoutes: Route[] = [
  { path: '', pathMatch: 'full', children: [{ path: '', component: GeneratorFormComponent }] }
];
