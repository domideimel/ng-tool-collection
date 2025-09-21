import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormModel, GenerationProperties } from '@ng-tool-collection/models';
import { FormsModule, Validators } from '@angular/forms';
import { atLeastOneCheckedValidator, CardComponent, FormComponent } from '@ng-tool-collection/ui';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Button } from 'primeng/button';
import { PasswordStore } from '../../services/passwords.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-generator-form',
  templateUrl: './generator-form.component.html',
  imports: [CardComponent, FormComponent, InputText, FormsModule, InputGroup, Button],
})
export class GeneratorFormComponent {
  formModel = {
    items: [
      {
        label: 'Passwort Länge',
        controlName: 'length',
        type: 'range',
        value: 10,
        validators: [Validators.required, Validators.min(6), Validators.max(100)],
      },
      {
        label: 'Großbuchstaben verwenden',
        controlName: 'upper',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Kleinbuchstaben verwenden',
        controlName: 'lower',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Sonderzeichen verwenden',
        controlName: 'symbol',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Zahlen verwenden',
        controlName: 'number',
        type: 'checkbox',
        value: true,
      },
    ],
    submitButtonLabel: 'Passwort generieren',
    customValidators: atLeastOneCheckedValidator(['upper', 'lower', 'symbol', 'number']),
  } as const satisfies FormModel;
  private passwordStore = inject(PasswordStore);
  hasCopied = computed(() => this.passwordStore.hasCopied());
  password = computed(() => this.passwordStore.currentPassword());

  onSubmit(value: unknown) {
    this.passwordStore.generatePassword(value as unknown as GenerationProperties);
  }

  copyToClipboard() {
    this.passwordStore.copyPassword(this.password());
  }
}
