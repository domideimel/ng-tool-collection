import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { Menubar } from 'primeng/menubar';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html',
  imports: [Menubar, RouterLink],
})
export class NavbarComponent {
  title = input('Tool Collection');
  links = input<MenuItem[]>(NAVIGATION);
}
