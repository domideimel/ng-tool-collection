import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { DrawerComponent } from './components/drawer/drawer.component';

@NgModule({
  imports: [CommonModule, RouterLink],
  declarations: [NavbarComponent, DrawerComponent],
  exports: [NavbarComponent, DrawerComponent]
})
export class UiModule {}
