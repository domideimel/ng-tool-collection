import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent, ServiceWorkerUpdatePromptComponent } from '@ng-tool-collection/ui';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  imports: [ConfirmDialog, RouterModule, ServiceWorkerUpdatePromptComponent, Button, NavbarComponent, Toast],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  currentYear = computed(() => {
    return new Date().getFullYear();
  });

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  constructor() {
    const analytics = localStorage.getItem('va-disable');
    effect(() => {
      if (!analytics) {
        this.confirm();
      }
    });
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Vercel Analytic',
      message: 'Diese Seite verwendet Vercel Analytics',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Akzeptiert', detail: 'Du hast akzeptiert' });
        this.accept('false');
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Abgelehnt', detail: 'Du hast abgelehnt' });
        this.accept('true');
      },
    });
  }

  private accept(accept: 'true' | 'false') {
    const formerValue = localStorage.getItem('va-disable');
    localStorage.setItem('va-disable', accept);

    if (accept !== formerValue) {
      window.location.reload();
    }
  }
}
