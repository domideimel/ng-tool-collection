import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorPasswordOverviewComponent implements OnInit {
  passwords = signal<string[] | null>([]);

  constructor (private storageService: LocalStorageService, private sessionStorageService: SessionStorageService) {}

  ngOnInit () {
    this.passwords.set(this.storageService.retrieve('passwords'));
    this.storageService.observe('passwords').subscribe(password => this.passwords.set(password));
  }

  async copy (password: string) {
    const oldToasts = this.sessionStorageService.retrieve('toasts');
    try {
      await navigator.clipboard.writeText(password);
      this.sessionStorageService.store('toasts', [...oldToasts, {
        alertType: 'alert-success',
        message: 'Passwort wurde erfolgreich kopiert',
        index: crypto.randomUUID()
      }]);
    } catch (e: unknown) {
      this.sessionStorageService.store('toasts', [...oldToasts, {
        alertType: 'alert-error',
        message: 'Beim kopieren ist etwas schief gelaufen',
        index: crypto.randomUUID()
      }]);
    }
  }

  delete (password: string) {
    const currentPasswords = this.storageService.retrieve('passwords') as string[];
    const oldToasts = this.sessionStorageService.retrieve('toasts');
    this.storageService.store('passwords', currentPasswords.filter(p => p !== password));
    this.sessionStorageService.store('toasts', [...oldToasts, {
      alertType: 'alert-success',
      message: 'Passwort wurde erfolgreich gelöscht',
      index: crypto.randomUUID()
    }]);
  }
}
