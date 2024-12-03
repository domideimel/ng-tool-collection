import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { BehaviorSubject, filter, Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
  imports: [NavbarComponent, RouterLinkActive, RouterLink, AsyncPipe],
})
export class DrawerComponent implements OnInit, OnDestroy {
  navItems = signal<Link[]>(NAVIGATION);
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  routerSubscription!: Subscription;

  private router = inject(Router);

  get currentYear() {
    return new Date().getFullYear();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isOpen$.next(false);
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onNavbarOpenChange(input: boolean | null | undefined) {
    if (!input) return;
    this.isOpen$.next(input);
  }

  toggleOpen(event: EventTarget | null): void {
    if (!event) return;
    this.isOpen$.next((event as HTMLInputElement).checked);
  }
}
