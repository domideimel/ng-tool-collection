import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { Link } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-submenu',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './submenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmenuComponent {
  item = input.required<Link>();
}
