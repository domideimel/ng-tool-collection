import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'lib-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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

  toggleSelected() {
    this.selected.set(!this.selected());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
