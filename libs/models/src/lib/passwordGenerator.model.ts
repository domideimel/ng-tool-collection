import { boolean, function as f, InferInput, maxValue, minValue, number, object, picklist, pipe } from 'valibot'; // Valibot schema for boolean properties

// Valibot schema for boolean properties
const BooleanPropertiesSchema = picklist(['lower', 'upper', 'number', 'symbol']);

// Valibot schema for random function
const RandomFunctionSchema = f();

// Valibot schema for GenerationProperties
const GenerationPropertiesSchema = object({
  lower: boolean(),
  upper: boolean(),
  number: boolean(),
  symbol: boolean(),
  length: pipe(number(), minValue(1), maxValue(1000)),
});

// Valibot schema for RandomFunc
const RandomFuncSchema = object({
  lower: RandomFunctionSchema,
  upper: RandomFunctionSchema,
  number: RandomFunctionSchema,
  symbol: RandomFunctionSchema,
});

// Infer types from schemas
export type BooleanProperties = InferInput<typeof BooleanPropertiesSchema>;
export type RandomFunction = () => string;
export type GenerationProperties = InferInput<typeof GenerationPropertiesSchema>;
export type RandomFunc = InferInput<typeof RandomFuncSchema>;

// Export schemas for validation
export { BooleanPropertiesSchema, RandomFunctionSchema, GenerationPropertiesSchema, RandomFuncSchema };
