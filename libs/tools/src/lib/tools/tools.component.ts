import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-tools',
  imports: [RouterOutlet],
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent {}
