import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalFormModel } from '@ng-tool-collection/models';
import { minLength, pipe, string } from 'valibot';
import { CardComponent, SignalFormComponent } from '@ng-tool-collection/ui';

@Component({
  selector: 'lib-signal-form',
  imports: [CardComponent, SignalFormComponent],
  templateUrl: './signal-form-component-lib.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormComponentLib {
  readonly formConfig: SignalFormModel = {
    items: [
      {
        controlName: 'some input',
        label: 'label',
        type: 'text',
        value: '',
        validators: pipe(string(), minLength(10, 'min length 10')),
      },
      {
        controlName: 'foo',
        label: 'label',
        type: 'select',
        value: 'test3',
        options: [
          {
            label: 'Damn Sone',
            value: 'test',
          },
          {
            label: 'Damn Sone 2',
            value: 'test2',
          },
          {
            label: 'Damn Sone 3',
            value: 'test3',
          },
        ],
      },
    ],
    submitButtonLabel: 'Hallo Welt',
  };
}
