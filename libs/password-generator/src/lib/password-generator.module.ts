import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { passwordGeneratorRoutes } from './lib.routes';
import { PasswordGeneratorComponent } from './components/password-generator.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(passwordGeneratorRoutes)],
  declarations: [PasswordGeneratorComponent]
})
export class PasswordGeneratorModule {}
