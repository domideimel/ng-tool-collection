import { Component, OnInit } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';

@Component({
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html'
})
export class DrawerComponent implements OnInit {
  navItems: Link[] = [];

  ngOnInit (): void {
    this.navItems = NAVIGATION;
  }
}
