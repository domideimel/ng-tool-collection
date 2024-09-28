import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);
  isDarkTheme = toSignal(this.themeService.isDarkTheme);

  switchTheme(event: EventTarget | null): void {
    if (!event) return;
    this.themeService.setDarkTheme((event as HTMLInputElement).checked);
  }
}
