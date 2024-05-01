import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Link } from '@ng-tool-collection/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  title = input('Tool Collection');
  links = input.required<Link[]>();
}
