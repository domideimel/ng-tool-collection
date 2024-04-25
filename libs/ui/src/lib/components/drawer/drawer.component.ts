import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
  standalone: true,
  imports: [NavbarComponent, RouterLinkActive, RouterLink]
})
export class DrawerComponent implements OnInit {
  navItems: Link[] = [];

  ngOnInit (): void {
    this.navItems = NAVIGATION;
  }
}
