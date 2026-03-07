import { ChangeDetectionStrategy, Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { array, GenericSchema, InferInput, object, optional, string, unknown } from 'valibot';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';

const FormControlOptionSchema = object({
  label: string(),
  value: unknown(), // More type-safe than any
});

const FormControlModelSchema = object({
  controlName: string(),
  label: string(),
  placeholder: optional(string()),
  value: optional(unknown()),
  type: string(),
  validators: optional(unknown()),
  options: optional(array(FormControlOptionSchema)),
});

const FormModelSchema = object({
  items: array(FormControlModelSchema),
  submitButtonLabel: string(),
});

type FormModel = InferInput<typeof FormModelSchema>;

@Component({
  selector: 'lib-signal-form',
  imports: [
    Checkbox,
    DatePicker,
    InputText,
    RadioButton,
    ReactiveFormsModule,
    Select,
    Slider,
    Textarea,
    Button,
    NgClass,
    FormField,
  ],
  templateUrl: './signal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormComponent<T extends FormModel> {
  readonly formModel = input<T>({
    items: [],
    submitButtonLabel: 'Submit',
  } as unknown as T);
  readonly submitEvent = output<unknown>();
  readonly errorEvent = output<unknown>();
  private readonly signalForm = linkedSignal(() => {
    return this.formModel().items.reduce<Record<string, unknown>>((acc, item) => {
      return {
        ...acc,
        [item.controlName]: item.value,
      };
    }, {});
  });
  private readonly validationSchema = computed(() => {
    const items = this.formModel().items;
    const hasAnyValidators = items.some(item => item.validators);
    if (!hasAnyValidators) {
      return null;
    }

    const schemaRecord = items.reduce(
      (acc, item) => {
        acc[item.controlName] = (item.validators as GenericSchema) || unknown();
        return acc;
      },
      {} as Record<string, GenericSchema>,
    );
    return object(schemaRecord);
  });
  readonly form = form(this.signalForm, p => {
    validateStandardSchema(p, () => this.validationSchema() ?? unknown());
  });

  constructor() {
    effect(() => {
      this.errorEvent.emit(this.form().errors?.());
    });
  }

  hasErrors(controlName: string) {
    return !!this.getField(controlName)?.().errors?.();
  }

  getErrorMessage(controlName: string) {
    const errors = this.getField(controlName)?.().errors?.();
    if (!errors) return '';
    // If it's a Valibot error, it might be an array or a single error
    if (Array.isArray(errors)) {
      return errors.map(e => (e as any)?.message).join(', ');
    }
    return typeof errors === 'string' ? errors : JSON.stringify(errors);
  }

  getField(controlName: string): any {
    return (this.form as any)[controlName];
  }

  reset() {
    const initialValues = this.formModel().items.reduce<Record<string, unknown>>((acc, item) => {
      return {
        ...acc,
        [item.controlName]: item.value,
      };
    }, {});
    this.signalForm.set(initialValues);
  }

  onSubmit() {
    this.submitEvent.emit(this.form().value());
  }
}
