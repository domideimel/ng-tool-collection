import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-builder-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './builder-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderDisplayComponent {}
