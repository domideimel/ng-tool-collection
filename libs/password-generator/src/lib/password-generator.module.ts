import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { passwordGeneratorRoutes } from './lib.routes';
import { GeneratorFormComponent } from './components/generator-form/generator-form.component';
import { UiModule } from '@ng-tool-collection/ui';

@NgModule({
  imports: [CommonModule, UiModule, RouterModule.forChild(passwordGeneratorRoutes)],
  declarations: [GeneratorFormComponent]
})
export class PasswordGeneratorModule {}
