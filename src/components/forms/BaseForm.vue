<!-- src/components/forms/BaseForm.vue -->
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import type { z, ZodTypeAny } from "zod";

interface Props<TSchema extends ZodTypeAny> {
  schema: TSchema;
  initialValues: Partial<z.infer<TSchema>>;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
}

const props = defineProps<Props<ZodTypeAny>>();
</script>

<template>
  <Form
    :validation-schema="toTypedSchema(props.schema)"
    :initial-values="props.initialValues"
    @submit="props.onSubmit"
    class="space-y-6"
  >
    <slot />
  </Form>
</template>
