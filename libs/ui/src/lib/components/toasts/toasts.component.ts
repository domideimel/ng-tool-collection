import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ToastService } from "./services/toasts.service";

@Component({
  selector: "lib-toasts",
  templateUrl: "./toasts.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsComponent {
  private toastsService = inject(ToastService);
  toasts = computed(() => this.toastsService.toasts());
}
