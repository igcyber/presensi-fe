import { FieldContextKey, useFieldError, useIsFieldDirty, useIsFieldTouched, useIsFieldValid } from "vee-validate";
import { inject, type InjectionKey, type MaybeRefOrGetter, toValue } from "vue";

import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys";

// Injection key for field name context (used by new pattern)
export const FIELD_NAME_CONTEXT_KEY = Symbol() as InjectionKey<MaybeRefOrGetter<string>>;

export function useFormField(name?: MaybeRefOrGetter<string>) {
  // Try to get name from parameter, injected context, or FieldContextKey
  const fieldNameContext = inject(FIELD_NAME_CONTEXT_KEY, null);
  const fieldContext = inject(FieldContextKey, null);
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY);

  let fieldName: MaybeRefOrGetter<string>;

  if (name) {
    // Name provided as parameter (new pattern)
    fieldName = name;
  } else if (fieldNameContext) {
    // Name from injected context (new pattern)
    fieldName = fieldNameContext;
  } else if (fieldContext) {
    // Name from FieldContextKey (old pattern - backward compatibility)
    fieldName = fieldContext.name;
  } else {
    throw new Error("useFormField: field name is required. Provide name prop or use within <FormField>");
  }

  const id = fieldItemContext || toValue(fieldName);

  const fieldState = {
    valid: useIsFieldValid(fieldName),
    isDirty: useIsFieldDirty(fieldName),
    isTouched: useIsFieldTouched(fieldName),
    error: useFieldError(fieldName),
  };

  return {
    id,
    name: fieldName,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}
