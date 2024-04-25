import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  @Input() title = 'Tool Collection';
  @Input() links: Link[] = [];
}
