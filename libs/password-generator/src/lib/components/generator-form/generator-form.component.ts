import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormModel, GenerationProperties } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { PasswordGeneratorService } from '../../services/password-generator.service';
import { atLeastOneCheckedValidator } from '@ng-tool-collection/ui';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-generator-form',
  templateUrl: './generator-form.component.html'
})
export class GeneratorFormComponent {
  formModel: FormModel = {
    items: [{
      label: 'Passwort Länge',
      controlName: 'length',
      type: 'range',
      value: 6,
      validators: [Validators.required, Validators.min(6), Validators.max(100)]
    }, {
      label: 'Großbuchstaben verwenden',
      controlName: 'upper',
      type: 'checkbox',
      value: true
    }, {
      label: 'Kleinbuchstaben verwenden',
      controlName: 'lower',
      type: 'checkbox',
      value: true
    }, {
      label: 'Sonderzeichen verwenden',
      controlName: 'symbol',
      type: 'checkbox',
      value: true
    }, {
      label: 'Zahlen verwenden',
      controlName: 'number',
      type: 'checkbox',
      value: true
    }],
    submitButtonLabel: 'Passwort generieren',
    customValidators: atLeastOneCheckedValidator(['upper', 'lower', 'symbol', 'number'])
  };

  password = signal<string>('');
  hasCopied = signal<boolean>(false);

  constructor (
    private passwordGeneratorService: PasswordGeneratorService,
    private storageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
  ) {}

  onSubmit (value: GenerationProperties) {
    this.password.set(this.passwordGeneratorService.generatePassword(value));
    this.hasCopied.set(false);
  }

  async copyToClipboard () {
    try {
      await navigator.clipboard.writeText(this.password());
      const oldPasswords = this.storageService.retrieve('passwords') ?? [];
      this.storageService.store('passwords', [this.password(), ...oldPasswords]);
      this.hasCopied.set(true);
      this.sessionStorageService.store('toasts', [{
        alertType: 'alert-success',
        message: 'Passwort wurde erfolgreich kopiert',
        index: crypto.randomUUID()
      }]);
    } catch (e: unknown) {
      this.sessionStorageService.store('toasts', [{
        alertType: 'alert-error',
        message: 'Beim kopieren ist etwas schief gelaufen',
        index: crypto.randomUUID()
      }]);
    }
  }

}
