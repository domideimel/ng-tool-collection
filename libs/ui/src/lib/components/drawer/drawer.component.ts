import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { BehaviorSubject, filter, Subscription, tap } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
  imports: [NavbarComponent, RouterLinkActive, RouterLink, AsyncPipe, Dialog, Button],
})
export class DrawerComponent implements OnInit, OnDestroy {
  navItems = signal<Link[]>(NAVIGATION);
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  routerSubscription!: Subscription;
  visibleAnalytics = signal(false);

  private router = inject(Router);

  constructor() {
    const analytics = localStorage.getItem('va-disable');
    effect(() => {
      if (!analytics) {
        this.openModal();
      }
    });
  }

  get currentYear() {
    return new Date().getFullYear();
  }

  openModal() {
    this.visibleAnalytics.set(true);
  }

  closeModal(accept: 'true' | 'false') {
    const formerValue = localStorage.getItem('va-disable');
    localStorage.setItem('va-disable', accept);

    this.visibleAnalytics.set(false);

    if (accept !== formerValue) {
      window.location.reload();
    }
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.isOpen$.next(false);
        }),
      )
      .subscribe();
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
