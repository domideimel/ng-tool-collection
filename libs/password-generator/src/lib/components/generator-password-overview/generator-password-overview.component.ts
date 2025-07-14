import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent, ToastService } from '@ng-tool-collection/ui';
import { CopyToClipboardDirective, ReactiveStorageService } from '@ng-tool-collection/utils';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CopyToClipboardDirective],
})
export class GeneratorPasswordOverviewComponent {
  private storageService = inject(ReactiveStorageService);
  passwords = this.storageService.getItem<string[]>('passwords');
  private toast = inject(ToastService);

  onCopySuccess() {
    this.toast.success('Passwort wurde erfolgreich kopiert');
  }

  onCopyError() {
    this.toast.error('Beim kopieren ist etwas schief gelaufen');
  }

  delete(password: string) {
    this.storageService.setItem(
      'passwords',
      this.passwords().filter(p => p !== password),
    );
    this.toast.success('Passwort wurde erfolgreich gelöscht');
  }
}
