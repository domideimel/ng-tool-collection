import { ChangeDetectionStrategy, Component, computed, inject, input, output, Signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';
import { NgClass } from '@angular/common';

type SignalValue<T> = T extends Signal<infer V> ? V : never;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html',
  imports: [ReactiveFormsModule, NgClass],
})
export class FormComponent<T extends FormModel> {
  model = input.required<T>();
  private value = computed(() => this.formGroup()?.value);
  submitEvent = output<SignalValue<typeof this.value>>();
  private fb = inject(NonNullableFormBuilder);
  formGroup = computed(() => {
    const formGroup = this.fb.group(
      this.model().items.reduce(
        (controls, item) => ({
          ...controls,
          [item.controlName]: this.fb.control(item.value, item.validators ? item.validators : []),
        }),
        {} as {
          [K in T['items'][number] as K['controlName']]: AbstractControl<K['value']>;
        },
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
    this.submitEvent.emit(this.value());
  }
}
