import { AbstractControl } from '@angular/forms';
import { any, array, InferInput, object, optional, string } from 'valibot';

// Valibot schema for form control option
const FormControlOptionSchema = object({
  label: string(),
  value: any(),
});

// Valibot schema for form control model
const FormControlModelSchema = object({
  controlName: string(),
  label: string(),
  placeholder: optional(string()),
  value: optional(any()),
  type: string(),
  validators: optional(any()), // Keep as any for Angular validator compatibility
  options: optional(array(FormControlOptionSchema)),
});

// Valibot schema for form model
const FormModelSchema = object({
  items: array(FormControlModelSchema),
  submitButtonLabel: string(),
  customValidators: optional(any()), // Keep as any for Angular validator compatibility
});

// Infer types from schemas
export type FormControlOption = InferInput<typeof FormControlOptionSchema>;
export type FormControlModel = InferInput<typeof FormControlModelSchema>;
export type FormModel = InferInput<typeof FormModelSchema>;

// Maintain the existing FormControls type for Angular compatibility
export type FormControls<T extends FormModel> = {
  [K in T['items'][number] as K['controlName']]: AbstractControl<K['value']>;
};

// Export schemas for validation
export { FormControlOptionSchema, FormControlModelSchema, FormModelSchema };
