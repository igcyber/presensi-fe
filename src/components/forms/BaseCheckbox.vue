<script setup lang="ts">
import { useField } from "vee-validate";
import { provide } from "vue";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";

import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  size?: "sm" | "default" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  size: "default",
});

const sizeClasses = {
  sm: "h-3 w-3",
  default: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const handleChange = (checked: boolean) => {
  setValue(checked, false);
};
</script>

<template>
  <FormItem class="flex flex-row items-start gap-3 space-y-0">
    <FormControl :name="props.name">
      <Checkbox
        :id="props.name"
        :checked="!!value"
        @update:checked="handleChange"
        :disabled="props.disabled"
        :aria-invalid="!!errorMessage"
        :aria-describedby="props.description ? `${props.name}-description` : undefined"
        :class="sizeClasses[props.size]"
      />
    </FormControl>
    <div class="flex-1 space-y-1 leading-none">
      <FormLabel
        :name="props.name"
        :for="props.name"
        :class="cn(props.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer')"
      >
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormDescription v-if="props.description" :name="props.name" :id="`${props.name}-description`">
        {{ props.description }}
      </FormDescription>
      <FormMessage :name="props.name" />
    </div>
  </FormItem>
</template>
