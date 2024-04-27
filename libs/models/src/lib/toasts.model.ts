export interface Toast {
  alertType: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error';
  message: string;
  index: string;
}

export type HorizontalAlignment = 'toast-start' | 'toast-center' | 'toast-end'
export type VerticalAlignment = 'toast-top' | 'toast-middle' | 'toast-bottom'
