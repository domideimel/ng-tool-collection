import { ChangeDetectionStrategy, Component, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { Menu } from 'primeng/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, Button, Drawer, Menu],
})
export class NavbarComponent {
  title = input('Tool Collection');
  links = input<MenuItem[]>(NAVIGATION);
  drawerVisible = signal(false);

  drawerRef = viewChild<Drawer>('drawerRef');

  openDrawer() {
    this.drawerVisible.set(true);
  }

  closeCallback(e: any): void {
    this.drawerRef()?.close(e);
  }
}
