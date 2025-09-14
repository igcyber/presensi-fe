<script setup lang="ts" generic="TSchema extends ZodTypeAny">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import type { z, ZodTypeAny } from "zod";

export interface BaseFormProps<TSchema extends ZodTypeAny> {
  schema: TSchema;
  initialValues?: Partial<z.infer<TSchema>>;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
  class?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<BaseFormProps<TSchema>>(), {
  initialValues: () => ({}),
  class: "space-y-6",
  disabled: false,
});

// Emit events for better parent component integration
const emit = defineEmits<{
  submit: [values: z.infer<TSchema>];
  "invalid-submit": [errors: Record<string, string>];
}>();

const handleSubmit = async (values: z.infer<TSchema>) => {
  try {
    await props.onSubmit(values);
    emit("submit", values);
  } catch (error) {
    console.error("Form submission error:", error);
  }
};

const handleInvalidSubmit = (ctx: any) => {
  const errors = Object.keys(ctx.errors).reduce(
    (acc, key) => {
      acc[key] = ctx.errors[key];
      return acc;
    },
    {} as Record<string, string>,
  );
  emit("invalid-submit", errors);
};
</script>

<template>
  <Form
    :validation-schema="toTypedSchema(props.schema)"
    :initial-values="props.initialValues"
    :class="props.class"
    :disabled="props.disabled"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <slot />
  </Form>
</template>
