import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormModel, GenerationProperties, Toast } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { PasswordGeneratorService } from '../../services/password-generator.service';
import { atLeastOneCheckedValidator } from '@ng-tool-collection/ui';

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
  messages = signal<Toast[]>([]);

  constructor (private passwordGeneratorService: PasswordGeneratorService) {}

  onSubmit (value: GenerationProperties) {
    this.password.set(this.passwordGeneratorService.generatePassword(value));
  }

  async copyToClipboard () {
    try {
      await navigator.clipboard.writeText(this.password());
      this.messages.update(old => [...old, {
        alertType: 'alert-success',
        message: 'Passwort wurde erfolgreich kopiert'
      }]);
    } catch (e: any) {
      this.messages.update(old => [...old, {
        alertType: 'alert-error',
        message: 'Beim kopieren ist etwas schief gelaufen'
      }]);
    }
  }

}
