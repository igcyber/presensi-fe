<script setup lang="ts" generic="TSchema extends ZodTypeAny">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { provide, watch } from "vue";
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

const emit = defineEmits<{
  submit: [values: z.infer<TSchema>];
  "invalid-submit": [errors: Record<string, string>];
}>();

const {
  handleSubmit: formHandleSubmit,
  values,
  errors,
  meta,
  setFieldValue,
  setFieldError,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues as any,
});

const handleFormSubmit = formHandleSubmit(
  async (values) => {
    try {
      await props.onSubmit(values as z.infer<TSchema>);
      emit("submit", values as z.infer<TSchema>);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  },
  ({ errors: validationErrors }) => {
    const errorMap = Object.keys(validationErrors as Record<string, any>).reduce(
      (acc, key) => {
        acc[key] = (validationErrors as Record<string, any>)[key] as string;
        return acc;
      },
      {} as Record<string, string>,
    );
    emit("invalid-submit", errorMap);
  },
);

provide("formContext", {
  values,
  errors,
  meta,
  setFieldValue,
  setFieldError,
  resetForm,
});

defineExpose({
  setFieldError,
  resetForm,
});

watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      resetForm({ values: newValues as any });
    }
  },
  { deep: true },
);
</script>

<template>
  <form :class="props.class" :disabled="props.disabled" @submit.prevent="handleFormSubmit">
    <slot :errors="errors" :meta="meta" :values="values" />
  </form>
</template>
