import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent, ServiceWorkerUpdatePromptComponent, ToastsComponent } from '@ng-tool-collection/ui';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  imports: [RouterModule, ToastsComponent, ServiceWorkerUpdatePromptComponent, Button, Dialog, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  visibleAnalytics = signal(false);
  currentYear = computed(() => {
    return new Date().getFullYear();
  });

  constructor() {
    const analytics = localStorage.getItem('va-disable');
    effect(() => {
      if (!analytics) {
        this.openModal();
      }
    });
  }

  openModal() {
    this.visibleAnalytics.set(true);
  }

  closeModal(accept: 'true' | 'false') {
    const formerValue = localStorage.getItem('va-disable');
    localStorage.setItem('va-disable', accept);

    this.visibleAnalytics.set(false);

    if (accept !== formerValue) {
      window.location.reload();
    }
  }
}
