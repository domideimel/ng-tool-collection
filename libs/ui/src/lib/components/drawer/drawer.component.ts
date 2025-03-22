import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { BehaviorSubject, filter, Subscription, tap } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgpButton } from 'ng-primitives/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-drawer',
  templateUrl: './drawer.component.html',
  imports: [NavbarComponent, RouterLinkActive, RouterLink, AsyncPipe, NgpButton],
})
export class DrawerComponent implements OnInit, OnDestroy {
  navItems = signal<Link[]>(NAVIGATION);
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  routerSubscription!: Subscription;
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

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
    this.dialog()?.nativeElement.showModal();
  }

  closeModal(accept: 'true' | 'false') {
    const formerValue = localStorage.getItem('va-disable');
    localStorage.setItem('va-disable', accept);

    this.dialog()?.nativeElement.close();

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
