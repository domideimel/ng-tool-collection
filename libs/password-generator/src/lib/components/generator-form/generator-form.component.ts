import { Component } from '@angular/core';
import { FormModel } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-generator-form',
  templateUrl: './generator-form.component.html'
})
export class GeneratorFormComponent {
  formModel: FormModel = {
    items: [{
      label: 'Länge',
      controlName: 'length',
      type: 'range'
    }, {
      label: 'Großbuchstaben verwenden',
      controlName: 'uppercase',
      type: 'checkbox'
    }, {
      label: 'Kleinbuchstaben verwenden',
      controlName: 'lowercase',
      type: 'checkbox'
    }, {
      label: 'Sonderzeichen verwenden',
      controlName: 'specialCharacters',
      type: 'checkbox'
    }, {
      label: 'Zahlen verwenden',
      controlName: 'numbers',
      type: 'checkbox'
    }],
    submitButtonLabel: 'Passwort generieren'
  };

  onSubmit (value: any) {
    console.log(value);
  }

}
