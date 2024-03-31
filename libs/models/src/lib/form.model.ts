export interface FormItems extends HTMLInputElement {
  label: string;
  options?: HTMLInputElement[] | HTMLOptionElement[];
}

export interface FormModel {
  items: FormItems[];
  submitButtonLabel: string;
}
