export interface FormItems extends Partial<HTMLInputElement> {
  label: string;
  options?: FormOptions[];
}

export interface FormModel {
  items: FormItems[];
  submitButtonLabel: string;
}

export interface FormOptions extends Omit<HTMLOptionElement, 'removeEventListener' | 'addEventListener'>, HTMLInputElement {
  label: string;
}
