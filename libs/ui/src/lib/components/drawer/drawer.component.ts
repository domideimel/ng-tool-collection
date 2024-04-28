import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html'
})
export class DrawerComponent implements OnInit {
  navItems: Link[] = [];
  isOpen = signal<boolean>(false);

  constructor (private router: Router) {}

  ngOnInit (): void {
    this.navItems = NAVIGATION;

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.isOpen.set(false);
      }
    });
  }
}
