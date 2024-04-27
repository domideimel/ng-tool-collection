import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const atLeastOneCheckedValidator = (controlNames: string[]): ValidatorFn => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (group: FormGroup): ValidationErrors | null => {
    const hasAtLeastOneChecked = controlNames.some(controlName => group.controls[controlName].value);

    if (hasAtLeastOneChecked) {
      return null;
    }
    return { atLeastOneChecked: true };
  };
};
