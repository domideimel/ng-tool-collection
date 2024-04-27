import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-generator-wrapper',
  templateUrl: './generator-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorWrapperComponent {}
