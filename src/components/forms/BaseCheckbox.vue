<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
};

const handleChange = (event: boolean, onChange: (event: boolean) => void) => {
  onChange(event);
};
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, errorMessage }">
    <FormItem class="flex flex-row items-start gap-3 space-y-0">
      <FormControl>
        <Checkbox
          :id="props.name"
          :checked="!!componentField.modelValue"
          @update:model-value="handleChange($event as boolean, componentField.onChange)"
          :disabled="props.disabled"
          :aria-invalid="!!errorMessage"
          :aria-describedby="props.description ? `${props.name}-description` : undefined"
          :class="sizeClasses[props.size]"
        />
      </FormControl>
      <div class="flex-1 space-y-1 leading-none">
        <FormLabel
          :for="props.name"
          :class="{ 'cursor-not-allowed opacity-70': props.disabled, 'cursor-pointer': !props.disabled }"
        >
          {{ props.label }}
          <span v-if="props.required" class="text-destructive">*</span>
        </FormLabel>
        <FormDescription v-if="props.description">
          {{ props.description }}
        </FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>
