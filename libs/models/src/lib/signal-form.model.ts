import { array, InferInput, literal, never, number, object, optional, string, union, unknown, variant } from 'valibot';
import { FormSubmitOptions } from '@angular/forms/signals';

export const SignalFormControlOptionSchema = object({
  label: string(),
  value: string(),
});

const baseControlFields = {
  controlName: string(),
  label: string(),
  placeholder: optional(string()),
  value: union([string(), number()]),
  validators: optional(unknown()),
};

export const SignalFormControlModelSchema = variant('type', [
  object({
    ...baseControlFields,
    type: union([literal('select'), literal('radio'), literal('checkbox-group'), literal('radio-group')]),
    options: array(SignalFormControlOptionSchema),
  }),
  object({
    ...baseControlFields,
    type: union([
      literal('text'),
      literal('number'),
      literal('checkbox'),
      literal('radio'),
      literal('date'),
      literal('slider'),
      literal('textarea'),
      literal('range'),
    ]),
    options: optional(never()),
  }),
]);

export const SignalFormModelSchema = object({
  items: array(SignalFormControlModelSchema),
  submitButtonLabel: string(),
  submitCallback: optional(unknown()),
});
type RawSignalFormModel = InferInput<typeof SignalFormModelSchema>;
export type SignalFormConfig<T extends SignalFormModel> = T;

export type SignalFormModel = Omit<RawSignalFormModel, 'submitCallback'> & {
  submitCallback?: FormSubmitOptions<unknown, any> | FormSubmitOptions<unknown, any>['action'];
};

export type ExtractFormValue<T extends SignalFormModel> = {
  [K in T['items'][number] as K['controlName']]: K['value'];
};

export const defineSignalForm = <const T extends SignalFormModel>(config: SignalFormConfig<T>): SignalFormConfig<T> =>
  config;
