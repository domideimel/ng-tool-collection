import { ChangeDetectionStrategy, Component, effect, Input, OnInit, signal } from '@angular/core';
import { type HorizontalAlignment, Toast, type VerticalAlignment } from '@ng-tool-collection/models';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'lib-toasts',
  templateUrl: './toasts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastsComponent implements OnInit {
  @Input() horizontalAlignment: HorizontalAlignment = 'toast-end';
  @Input() verticalAlignment: VerticalAlignment = 'toast-bottom';

  toasts = signal<Toast[]>([]);

  constructor (private storageService: SessionStorageService) {
    effect(() => {
      this.storageService.store('toasts', this.toasts());
    }, {
      allowSignalWrites: true
    });
  }

  ngOnInit () {
    this.storageService.store('toasts', []);
    this.storageService.observe('toasts').subscribe(toasts => {
      this.toasts.set(toasts);
      setTimeout(() => this.removeWithDelay(), 3000);
    });
  }

  async removeWithDelay () {
    for (const item of this.toasts()) {
      this.toasts.update(toasts => toasts.filter(i => i !== item));
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay with Promise
    }
  }
}
