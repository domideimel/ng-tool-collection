import { AbstractControl, ValidationErrors } from '@angular/forms';
import isURL from 'validator/es/lib/isURL';

export function urlValidator (control: AbstractControl): ValidationErrors | null {
  if (control.value && !isURL(control.value)) {
    return { 'invalidUrl': true }; // Custom error key
  }
  return null;
}
