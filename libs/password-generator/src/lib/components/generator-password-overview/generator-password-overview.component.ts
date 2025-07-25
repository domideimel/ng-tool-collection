import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '@ng-tool-collection/ui';
import { CopyToClipboardDirective, ReactiveStorageService } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CopyToClipboardDirective, Button],
})
export class GeneratorPasswordOverviewComponent {
  private storageService = inject(ReactiveStorageService);
  passwords = this.storageService.getItem<string[]>('passwords');
  private messageService = inject(MessageService);

  onCopySuccess() {
    this.messageService.add({ severity: 'success', detail: 'Passwort wurde erfolgreich kopiert' });
  }

  onCopyError() {
    this.messageService.add({ severity: 'error', detail: 'Beim kopieren ist etwas schief gelaufen' });
  }

  delete(password: string) {
    this.storageService.setItem(
      'passwords',
      this.passwords().filter(p => p !== password),
    );
    this.messageService.add({ severity: 'success', detail: 'Passwort wurde erfolgreich gelöscht' });
  }
}
