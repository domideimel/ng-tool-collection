import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderComponent {}
