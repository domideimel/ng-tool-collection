import { FormGroup, ValidatorFn } from '@angular/forms';

export const atLeastOneCheckedValidator = (controlNames: string[]): ValidatorFn => {
  return (group: FormGroup): { [key: string]: any | null } | null => {
    const hasAtLeastOneChecked = controlNames.some(controlName => group.controls[controlName].value);

    if (hasAtLeastOneChecked) {
      return null;
    }
    return { atLeastOneChecked: true };
  };
};
