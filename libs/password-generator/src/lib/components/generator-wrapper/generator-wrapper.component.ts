import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';

@Component({
  selector: 'lib-generator-wrapper',
  templateUrl: './generator-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GeneratorFormComponent]
})
export class GeneratorWrapperComponent {}
