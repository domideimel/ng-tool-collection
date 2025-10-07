import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent, ServiceWorkerUpdatePromptComponent } from '@ng-tool-collection/ui-core';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  imports: [RouterModule, ServiceWorkerUpdatePromptComponent, NavbarComponent, Toast],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  currentYear = computed(() => {
    return new Date().getFullYear();
  });
}
