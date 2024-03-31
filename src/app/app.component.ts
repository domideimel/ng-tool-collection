import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@ng-tool-collection/ui';

@Component({
  standalone: true,
  imports: [RouterModule, UiModule],
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
}
