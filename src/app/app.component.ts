import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgNavbarComponent } from '@ng-tool-collection/ui';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';

@Component({
  standalone: true,
  imports: [RouterModule, NgNavbarComponent],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  navItems = signal<Link[]>(NAVIGATION);

  get currentYear() {
    return new Date().getFullYear();
  }
}
