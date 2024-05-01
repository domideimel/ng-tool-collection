import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  navItems = signal<Link[]>(NAVIGATION);

  get currentYear() {
    return new Date().getFullYear();
  }
}
