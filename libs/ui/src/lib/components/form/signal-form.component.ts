import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { Field, form, FormField, submit, validateStandardSchema } from '@angular/forms/signals';
import { GenericSchema, object, unknown } from 'valibot';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';
import { AngularSubmitCallback, ExtractFormValue, SignalFormModel } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-signal-form',
  imports: [Checkbox, InputText, RadioButton, ReactiveFormsModule, Slider, Textarea, Button, NgClass, FormField],
  templateUrl: './signal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormComponent<T extends SignalFormModel> {
  readonly formModel = input<T>({
    items: [],
    submitButtonLabel: 'Submit',
  } as unknown as T);
  readonly submitEvent = output<ExtractFormValue<T>>();
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

  private readonly touchedFields = signal<Record<string, boolean>>({});
  private readonly hasAttemptedSubmit = signal(false);

  constructor() {
    effect(() => {
      this.errorEvent.emit(this.form().errors?.());
    });
  }

  hasErrors(controlName: string) {
    return !!this.getField(controlName)?.().errors?.();
  }

  onBlur(controlName: string) {
    this.touchedFields.update(prev => ({ ...prev, [controlName]: true }));
  }

  shouldShowError(controlName: string): boolean {
    const hasError = !!this.getField(controlName)?.().errors?.();
    if (!hasError) return false;

    const mode = this.formModel().validationMode || 'instant';

    if (mode === 'instant') return true;
    if (this.hasAttemptedSubmit()) return true;
    if (mode === 'blur') return this.touchedFields()[controlName];

    return false; // 'submit' mode logic
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

  getField(controlName: string) {
    return this.form[controlName] as Field<any, any>;
  }

  reset() {
    const initialValues = this.formModel().items.reduce<Record<string, unknown>>((acc, item) => {
      return {
        ...acc,
        [item.controlName]: item.value,
      };
    }, {});
    this.signalForm.set(initialValues);
    this.touchedFields.set({});
    this.hasAttemptedSubmit.set(false);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.hasAttemptedSubmit.set(true);
    const callback = this.formModel().submitFunctionCallback;

    if (callback) {
      const isValid = await submit(this.form, callback as AngularSubmitCallback<Record<string, unknown>>);

      if (!isValid) return;

      this.submitEvent.emit(this.form().value() as unknown as ExtractFormValue<T>);
      return;
    }

    this.submitEvent.emit(this.form().value() as unknown as ExtractFormValue<T>);
  }
}
