import { Component, signal } from '@angular/core';
import { FormModel, GenerationProperties } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { PasswordGeneratorService } from '../../services/password-generator.service';

@Component({
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
    submitButtonLabel: 'Passwort generieren'
  };
  password = signal<string>('');

  constructor (private pgenService: PasswordGeneratorService) {}

  onSubmit (value: GenerationProperties) {
    this.password.set(this.pgenService.generatePassword(value));
  }

  async copyToClipboard () {
    await navigator.clipboard.writeText(this.password());
  }

}
