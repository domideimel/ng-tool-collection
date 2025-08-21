import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { OfflineIndicatorComponent } from '@ng-tool-collection/ui';

@Component({
  selector: 'lib-tools',
  imports: [RouterOutlet, OfflineIndicatorComponent],
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent {}
