import { Route } from '@angular/router';
import { GeneratorWrapperComponent } from './components/generator-wrapper/generator-wrapper.component';

export const passwordGeneratorRoutes: Route[] = [
  { path: '', pathMatch: 'full', children: [{ path: '', component: GeneratorWrapperComponent }] }
];
