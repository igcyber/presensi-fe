<script lang="ts" setup>
import { ErrorMessage } from "vee-validate";
import type { HTMLAttributes } from "vue";
import { toValue } from "vue";

import { cn } from "@/lib/utils";

import { useFormField } from "./useFormField";

const props = defineProps<{
  name?: string;
  class?: HTMLAttributes["class"];
}>();

const { name: fieldName, formMessageId, error } = useFormField(props.name);
</script>

<template>
  <ErrorMessage
    v-if="error"
    :id="formMessageId"
    data-slot="form-message"
    as="p"
    :name="toValue(fieldName)"
    :class="cn('text-destructive text-sm', props.class)"
  />
</template>
