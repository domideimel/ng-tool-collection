import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderGeneratorComponent } from '../builder-generator/builder-generator.component';
import { BuilderDisplayComponent } from '../builder-display/builder-display.component';

@Component({
  selector: 'lib-builder',
  standalone: true,
  imports: [CommonModule, BuilderGeneratorComponent, BuilderDisplayComponent],
  templateUrl: './builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent {}
