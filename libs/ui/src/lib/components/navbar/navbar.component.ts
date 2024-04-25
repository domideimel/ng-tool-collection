import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Link } from '@ng-tool-collection/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() title = 'Tool Collection';
  @Input() links: Link[] = [];
}
