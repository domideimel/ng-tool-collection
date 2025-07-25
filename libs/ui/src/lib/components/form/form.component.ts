import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControls, FormModel } from '@ng-tool-collection/models';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { Slider } from 'primeng/slider';
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { RadioButton } from 'primeng/radiobutton';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    Button,
    Slider,
    DatePicker,
    Textarea,
    Select,
    RadioButton,
    Checkbox,
    InputText,
  ],
})
export class FormComponent<T extends FormModel> implements OnInit {
  formModel = input.required<T>();
  formGroup!: FormGroup;
  submitEvent = output<typeof this.value>();
  private fb = inject(NonNullableFormBuilder);

  constructor() {
    effect(() => {
      this.formGroup = this.generateFormGroup(this.formModel());
    });
  }

  get value() {
    return this.formGroup?.value;
  }

  ngOnInit() {
    this.formGroup = this.generateFormGroup(this.formModel());
  }

  hasErrors(controlName: string): ValidationErrors | undefined | null {
    return this.formGroup.get(controlName)?.errors;
  }

  onSubmit() {
    this.submitEvent.emit(this.value);
  }

  private generateFormGroup(model: T) {
    const formGroup = this.fb.group(
      model.items.reduce(
        (controls, item) => ({
          ...controls,
          [item.controlName]: this.fb.control(item.value, item.validators ? item.validators : []),
        }),
        {} as FormControls<T>,
      ),
    );
    if (model?.customValidators) {
      formGroup.setValidators(model.customValidators as ValidatorFn | ValidatorFn[]);
    }

    return formGroup;
  }
}
