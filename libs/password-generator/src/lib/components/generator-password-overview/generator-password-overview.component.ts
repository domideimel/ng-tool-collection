import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardComponent, ToastService } from '@ng-tool-collection/ui';
import { CopyToClipboardDirective } from '@ng-tool-collection/utils';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CopyToClipboardDirective],
})
export class GeneratorPasswordOverviewComponent {
  passwords = computed<string[]>(() => {
    if (!this.newPasswords()) return this.initialPasswords() ?? [];
    return this.newPasswords() ?? [];
  });
  private storageService = inject(LocalStorageService);
  newPasswords = toSignal<string[]>(this.storageService.observe('passwords'));
  initialPasswords = signal<string[]>(this.storageService.retrieve('passwords'));
  private toast = inject(ToastService);

  onCopySuccess() {
    this.toast.success('Passwort wurde erfolgreich kopiert');
  }

  onCopyError() {
    this.toast.error('Beim kopieren ist etwas schief gelaufen');
  }

  delete(password: string) {
    const currentPasswords = this.storageService.retrieve('passwords') as string[];
    this.storageService.store(
      'passwords',
      currentPasswords.filter(p => p !== password),
    );
    this.toast.success('Passwort wurde erfolgreich gelöscht');
  }
}
