import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceWorkerStore } from '@ng-tool-collection/utils';

@Component({
  selector: 'lib-service-worker-update-prompt',
  imports: [CommonModule],
  templateUrl: './service-worker-update-prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
