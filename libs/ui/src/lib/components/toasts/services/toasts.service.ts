import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ToastMessage, ToastType } from "@ng-tool-collection/models";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastMessagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts = this.toastMessagesSubject.asObservable();

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
    this.toastMessagesSubject.next([...this.toastMessagesSubject.value, toast]);
    // Remove the toast message after 3 seconds
    setTimeout(() => this.removeToast(toast.id), 3000);
  }

  private removeToast(id: string) {
    const updatedMessages = this.toastMessagesSubject.value.filter(toast => toast.id !== id);
    this.toastMessagesSubject.next(updatedMessages);
  }
}
