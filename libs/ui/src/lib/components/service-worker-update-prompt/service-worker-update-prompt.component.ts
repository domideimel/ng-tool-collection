import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ServiceWorkerStore } from '@ng-tool-collection/utils';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'lib-service-worker-update-prompt',
  templateUrl: './service-worker-update-prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Dialog],
})
export class ServiceWorkerUpdatePromptComponent {
  private serviceWorkerStore = inject(ServiceWorkerStore);
  hasUpdates = computed(() => this.serviceWorkerStore.hasUpdates());

  updateApp() {
    this.serviceWorkerStore.update();
  }

  ignoreUpdate() {
    this.serviceWorkerStore.updateHasUpdates(false);
    this.serviceWorkerStore.destroy();
  }
}
