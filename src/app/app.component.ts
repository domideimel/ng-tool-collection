import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerComponent, ServiceWorkerUpdatePromptComponent, ToastsComponent } from '@ng-tool-collection/ui';

@Component({
  imports: [RouterModule, DrawerComponent, ToastsComponent, ServiceWorkerUpdatePromptComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
