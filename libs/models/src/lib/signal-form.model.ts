import { array, InferInput, literal, never, number, object, optional, string, union, unknown, variant } from 'valibot';
import type { FieldTree, TreeValidationResult, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

/**
 * Represents an option for selection-based form controls (Select, Radio, Checkbox Group).
 */
export const SignalFormControlOptionSchema = object({
  label: string(),
  value: string(),
});

/**
 * Shared base fields for all form control configurations.
 */
const baseControlFields = {
  controlName: string(),
  label: string(),
  placeholder: optional(string()),
  value: union([string(), number()]),
  validators: optional(unknown()),
};

/**
 * Discriminated union of all supported form control models.
 */
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

/**
 * Valibot schema for the complete Signal Form configuration.
 */
export const SignalFormModelSchema = object({
  items: array(SignalFormControlModelSchema),
  submitButtonLabel: string(),
  submitFunctionCallback: optional(unknown()),
  validationMode: optional(union([literal('instant'), literal('blur'), literal('submit')]), 'instant'),
});

/**
 * Type definition for the Angular Signal Forms 'submit' utility callback.
 * Ensures the callback receives correctly typed field trees for the form value.
 */
export type AngularSubmitCallback<TValue = Record<string, unknown>> = (
  field: FieldTree<TValue, string | number>,
  detail: {
    root: FieldTree<unknown, string | number>;
    submitted: FieldTree<TValue, string | number>;
  },
) => Promise<TreeValidationResult<WithOptionalFieldTree<ValidationError>>>;

/**
 * Base inferred type from the Valibot schema used for internal constraints.
 */
export type RawSignalFormModel = InferInput<typeof SignalFormModelSchema>;

/**
 * Maps a SignalFormModel configuration to its corresponding value object shape.
 * Useful for typing event emitters and component outputs.
 */
export type ExtractFormValue<T extends RawSignalFormModel> = {
  [K in T['items'][number] as K['controlName']]: K['value'];
};

/**
 * The refined SignalFormModel that provides strict typing for the Angular Signal Form callback.
 * @template TValue The object shape representing the form's data.
 */
export type SignalFormModel<TValue = any> = Omit<RawSignalFormModel, 'submitFunctionCallback'> & {
  submitFunctionCallback?: AngularSubmitCallback<TValue>;
};

/**
 * A type-safe builder for Signal Form configurations.
 * Correctly infers the object shape of the form values from the 'items' array literal.
 * * @example
 * const myForm = defineSignalForm({
 * items: [{ controlName: 'email', type: 'text', value: '' }],
 * submitButtonLabel: 'Send',
 * submitFunctionCallback: async (field) => { ... }
 * });
 */
export const defineSignalForm = <
  const TItems extends RawSignalFormModel['items'],
  const TRest extends Omit<RawSignalFormModel, 'items' | 'submitFunctionCallback'>,
>(
  config: TRest & {
    items: TItems;
    submitFunctionCallback?: AngularSubmitCallback<{
      [K in TItems[number] as K['controlName']]: K['value'];
    }>;
  },
): SignalFormModel<{ [K in TItems[number] as K['controlName']]: K['value'] }> & TRest => {
  return config as any;
};
