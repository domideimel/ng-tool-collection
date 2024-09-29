import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
})
export class FormComponent {
  model = input.required<FormModel>();
  submitEvent = output<any>();
  private fb = inject(FormBuilder);
  formGroup = computed<FormGroup>(() => {
    const formGroup = this.fb.group({});

    this.model().items.forEach(item => {
      formGroup.addControl(item.controlName, this.fb.control(item.value, item.validators ? item.validators : []));
    });

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
