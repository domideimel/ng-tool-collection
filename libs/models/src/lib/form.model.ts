import { ValidatorFn, Validators } from '@angular/forms';

export interface FormModel {
  items?: FormControlModel[];
  submitButtonLabel: string;
  customValidators?: ValidatorFn | ValidatorFn[];
}

export interface FormControlModel {
  controlName: string;
  label: string;
  placeholder?: string;
  value?: unknown;
  type: string;
  validators?: ValidatorFn[] | ValidatorFn | Validators[] | Validators;
  options?: { label: string, value: any }[];
}


