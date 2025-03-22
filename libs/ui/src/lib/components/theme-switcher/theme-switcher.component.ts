import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { NgpButton } from 'ng-primitives/button';
import { NgpToggle } from 'ng-primitives/toggle';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'lib-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgpButton, NgpToggle],
})
export class ThemeSwitcherComponent implements OnDestroy {
  readonly selected = signal(false);
  private themeService = inject(ThemeService);
  private readonly subscriptions = new Subscription();

  constructor() {
    effect(() => {
      this.themeService.setDarkTheme(this.selected());
    });
    this.subscriptions.add(
      this.themeService.isDarkTheme.pipe(tap(isDarkTheme => this.selected.set(isDarkTheme))).subscribe(),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
