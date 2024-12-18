import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-tools',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent {}
