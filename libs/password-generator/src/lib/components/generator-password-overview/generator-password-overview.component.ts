import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorPasswordOverviewComponent implements OnInit {
  passwords = signal<string[] | null>([]);

  constructor (private storageService: LocalStorageService, private toast: HotToastService) {}

  ngOnInit () {
    this.passwords.set(this.storageService.retrieve('passwords'));
    this.storageService.observe('passwords').subscribe(password => this.passwords.set(password));
  }

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
