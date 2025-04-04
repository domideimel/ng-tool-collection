import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubmenuComponent } from './submenu/submenu.component';
import { NgpButton } from 'ng-primitives/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, RouterLinkActive, ThemeSwitcherComponent, SubmenuComponent, NgpButton],
})
export class NavbarComponent {
  title = input('Tool Collection');
  links = input.required<Link[]>();
  openNavbar = model<boolean | null>();

  onOpenClick() {
    if (this.openNavbar()) {
      this.openNavbar.set(false);
      return;
    }
    this.openNavbar.set(true);
  }
}
