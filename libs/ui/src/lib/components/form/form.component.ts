import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html',
  imports: [ReactiveFormsModule, NgClass],
})
export class FormComponent<T extends FormModel> {
  model = input.required<FormModel>();
  submitEvent = output<any>();
  private fb = inject(FormBuilder);
  formGroup = computed<FormGroup<{ [K in T['items'][number]['controlName']]: AbstractControl }>>(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const formGroup: FormGroup<{ [K in T['items'][number]['controlName']]: AbstractControl }> = this.fb.group(
      this.model().items.reduce(
        (controls, item) => ({
          ...controls,
          [item.controlName]: this.fb.control(item.value, item.validators ? item.validators : []),
        }),
        {},
      ),
    );
    if (this.model()?.customValidators) {
      formGroup.setValidators(this.model().customValidators as ValidatorFn | ValidatorFn[]);
    }

    return formGroup;
  });

  hasErrors(controlName: string): ValidationErrors | undefined | null {
    return this.formGroup().get(controlName)?.errors;
  }

  onSubmit() {
    this.submitEvent.emit(this.formGroup()?.value);
  }
}
