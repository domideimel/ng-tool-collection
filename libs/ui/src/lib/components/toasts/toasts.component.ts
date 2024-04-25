import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { type HorizontalAlignment, Toast, type VerticalAlignment } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-toasts',
  templateUrl: './toasts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastsComponent {
  @Input() horizontalAlignment: HorizontalAlignment = 'toast-end';
  @Input() verticalAlignment: VerticalAlignment = 'toast-bottom';
  @Input() toasts: Toast[] = [];
}
