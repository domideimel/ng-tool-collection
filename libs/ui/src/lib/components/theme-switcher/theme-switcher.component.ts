import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ThemeService } from './services/theme.service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'lib-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ThemeSwitcherComponent {
  isDarkTheme = toSignal(this.themeService.isDarkTheme)

  constructor (public themeService: ThemeService) {}

  switchTheme (event: EventTarget | null): void {
    if (!event) return
    this.themeService.setDarkTheme((event as HTMLInputElement).checked)
  }
}
