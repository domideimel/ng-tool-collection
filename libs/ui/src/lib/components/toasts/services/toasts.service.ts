import { Injectable, Signal, signal } from "@angular/core";
import { ToastMessage, ToastType } from "@ng-tool-collection/models";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastMessagesSignal = signal<ToastMessage[]>([]);
  readonly toasts: Signal<ToastMessage[]> = this.toastMessagesSignal.asReadonly();

  success(message: string) {
    this.showToast(message, "success");
  }

  error(message: string) {
    this.showToast(message, "error");
  }

  info(message: string) {
    this.showToast(message, "info");
  }

  warning(message: string) {
    this.showToast(message, "warning");
  }

  private showToast(message: string, type: ToastType) {
    const toast: ToastMessage = { id: crypto.randomUUID(), message, type };

    // Add the new toast message to the array
    this.toastMessagesSignal.update(messages => [...messages, toast]);

    // Remove the toast message after set timeout or 3 seconds
    setTimeout(() => this.removeToast(toast.id), toast?.timeout ?? 3000);
  }

  private removeToast(id: string) {
    this.toastMessagesSignal.update(messages => messages.filter(toast => toast.id !== id));
  }
}
