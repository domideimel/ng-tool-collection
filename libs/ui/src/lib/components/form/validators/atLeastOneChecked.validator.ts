import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneCheckedValidator = (controlNames: string[]): ValidatorFn => {
  // @ts-ignore
  return (group: FormGroup): ValidationErrors | null => {
    const hasAtLeastOneChecked = controlNames.some(controlName => group.controls[controlName].value);

    if (hasAtLeastOneChecked) {
      return null;
    }
    return { atLeastOneChecked: true };
  };
};
