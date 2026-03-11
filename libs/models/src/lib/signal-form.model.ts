import { array, InferInput, object, optional, string, unknown } from 'valibot';

export const SignalFormControlOptionSchema = object({
  label: string(),
  value: unknown(), // More type-safe than any
});

export const SignalFormControlModelSchema = object({
  controlName: string(),
  label: string(),
  placeholder: optional(string()),
  value: optional(unknown()),
  type: string(),
  validators: optional(unknown()),
  options: optional(array(SignalFormControlOptionSchema)),
});

export const SignalFormModelSchema = object({
  items: array(SignalFormControlModelSchema),
  submitButtonLabel: string(),
});

export type SignalFormModel = InferInput<typeof SignalFormModelSchema>;
