<script lang="ts" setup>
import type { LabelProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { useFormField } from "./useFormField";

const props = defineProps<LabelProps & { name?: string; class?: HTMLAttributes["class"]; customFor?: string }>();

const { error, formItemId } = useFormField(props.name);
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive', props.class)"
    :for="props.customFor || formItemId"
  >
    <slot />
  </Label>
</template>
