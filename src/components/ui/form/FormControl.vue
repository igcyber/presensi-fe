<script lang="ts" setup>
import { Slot } from "reka-ui";

import { useFormField } from "./useFormField";

const props = defineProps<{
  name?: string;
}>();

const { error, formItemId, formDescriptionId, formMessageId } = useFormField(props.name);
</script>

<template>
  <Slot
    :id="formItemId"
    data-slot="form-control"
    :aria-describedby="!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error"
  >
    <slot />
  </Slot>
</template>
