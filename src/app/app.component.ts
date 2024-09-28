import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerComponent, ToastsComponent } from '@ng-tool-collection/ui';

@Component({
  standalone: true,
  imports: [RouterModule, DrawerComponent, ToastsComponent],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
