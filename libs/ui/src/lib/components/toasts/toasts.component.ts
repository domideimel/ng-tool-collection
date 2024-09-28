import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toasts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastMessage } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsComponent {
  private toastsService = inject(ToastService);
  toasts = toSignal<ToastMessage[]>(this.toastsService.toasts);
}
