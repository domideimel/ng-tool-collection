import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Link } from '@ng-tool-collection/models';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lib-ng-navbar',
  templateUrl: './ng-navbar.component.html',
  styleUrl: './ng-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLinkActive,
    RouterLink,
  ],
})
export class NgNavbarComponent {
  title = input('Tool Collection');
  links = input.required<Link[]>();
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );
  private router = inject(Router);

  isActiveRoute(route: Link) {
    return this.router.isActive(route.path, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
