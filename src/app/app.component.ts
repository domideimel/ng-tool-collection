import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerComponent, ToastsComponent } from '@ng-tool-collection/ui';
import { ServiceWorkerStore } from '@ng-tool-collection/utils';

@Component({
  imports: [RouterModule, DrawerComponent, ToastsComponent],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
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
