import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormModel } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { UrlRewriteModel } from '../../../../models/src/lib/urlRewrite.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html'
})
export class UrlRewritesComponent {
  formModel: FormModel = {
    submitButtonLabel: 'Generieren',
    rows: [[{
      label: 'Alte URL',
      controlName: 'oldUrl_1',
      type: 'url',
      validators: [Validators.min(1)],
      placeholder: 'https://oldUrl.com'
    }, {
      label: 'Neue URL',
      controlName: 'newUrl_1',
      type: 'url',
      validators: [Validators.min(1)],
      placeholder: 'https://newUrl.com'
    }]]
  };

  onSubmit (value: UrlRewriteModel[]) {
    console.log(value);
  }
}
