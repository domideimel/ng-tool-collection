import { Component } from '@angular/core';
import { Link } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html'
})
export class DrawerComponent {
  navItems: Link[] = [{
    label: 'Passwort Generator',
    path: 'password-generator'
  }, {
    label: 'Url Rewrites',
    path: 'url-rewrites'
  }];
}
