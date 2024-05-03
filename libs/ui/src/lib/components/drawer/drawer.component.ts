import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { Link } from "@ng-tool-collection/models";
import { NAVIGATION } from "@ng-tool-collection/constants";
import { BehaviorSubject, filter, Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "lib-drawer",
  templateUrl: "./drawer.component.html",
})
export class DrawerComponent implements OnInit, OnDestroy {
  navItems = signal<Link[]>(NAVIGATION);
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  routerSubscription!: Subscription;

  constructor(private router: Router) {}

  get currentYear() {
    return new Date().getFullYear();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
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
