import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerComponent } from './components/drawer/drawer.component';
import { CardComponent } from './components/card/card.component';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastsComponent } from './components/toasts/toasts.component';

@NgModule({
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  declarations: [
    NavbarComponent,
    DrawerComponent,
    CardComponent,
    FormComponent,
    ToastsComponent
  ],
  exports: [NavbarComponent, DrawerComponent, CardComponent, FormComponent, ToastsComponent]
})
export class UiModule {}
