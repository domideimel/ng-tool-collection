import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '@ng-tool-collection/ui';
import { CopyToClipboardDirective, ReactiveStorageService } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { PG_I18N } from '@ng-tool-collection/constants';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CopyToClipboardDirective, Button],
})
export class GeneratorPasswordOverviewComponent {
  protected readonly i18n = PG_I18N;
  private storageService = inject(ReactiveStorageService);
  passwords = this.storageService.getItem<string[]>('passwords');
  private messageService = inject(MessageService);

  onCopySuccess() {
    this.messageService.add({ severity: 'success', detail: this.i18n.copySuccess });
  }

  onCopyError() {
    this.messageService.add({ severity: 'error', detail: this.i18n.copyError });
  }

  delete(password: string) {
    this.storageService.setItem(
      'passwords',
      this.passwords().filter(p => p !== password),
    );
    this.messageService.add({ severity: 'success', detail: this.i18n.deleteSuccess });
  }
}
