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
      type: 'text',
      placeholder: 'Länge'
    }],
    submitButtonLabel: 'Passwort generieren'
  };
}
