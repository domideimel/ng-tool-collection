import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { HotToastService } from '@ngneat/hot-toast';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorPasswordOverviewComponent {
  newPasswords = toSignal<string[]>(this.storageService.observe('passwords'));
  initialPasswords = signal<string[]>(this.storageService.retrieve('passwords'));
  passwords = computed<string[]>(() => {
    if (!this.newPasswords()) return this.initialPasswords();
    return this.newPasswords() as string[];
  });

  constructor (private storageService: LocalStorageService, private toast: HotToastService) {}

  async copy (password: string) {
    try {
      await navigator.clipboard.writeText(password);
      this.toast.success('Passwort wurde erfolgreich kopiert');
    } catch (e: unknown) {
      this.toast.error('Beim kopieren ist etwas schief gelaufen');
    }
  }

  delete (password: string) {
    const currentPasswords = this.storageService.retrieve('passwords') as string[];
    this.storageService.store('passwords', currentPasswords.filter(p => p !== password));
    this.toast.success('Passwort wurde erfolgreich gelöscht');
  }
}
