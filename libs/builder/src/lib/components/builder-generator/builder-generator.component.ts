import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-builder-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './builder-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderGeneratorComponent {}
