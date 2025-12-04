<script setup lang="ts">
import { useField } from "vee-validate";
import { provide } from "vue";

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  name: string;
  label: string;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  description?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  orientation: "vertical",
  size: "default",
});

const sizeClasses = {
  sm: "h-3 w-3",
  default: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

const orientationClasses = {
  horizontal: "flex flex-row flex-wrap gap-4",
  vertical: "flex flex-col space-y-3",
} as const;

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const handleChange = (val: string | number | undefined) => {
  setValue(val, false);
};
</script>

<template>
  <FormItem>
    <FormLabel :name="props.name" :for="props.name" :class="cn(props.disabled && 'cursor-not-allowed opacity-70')">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>

    <FormControl :name="props.name">
      <RadioGroup
        :id="props.name"
        :model-value="value as any"
        @update:model-value="handleChange"
        :disabled="props.disabled"
        :aria-invalid="!!errorMessage"
        :aria-describedby="props.description ? `${props.name}-description` : undefined"
        :class="orientationClasses[props.orientation]"
        :required="props.required"
      >
        <div v-for="option in props.options" :key="option.value" class="flex items-center space-x-2">
          <RadioGroupItem
            :id="`${props.name}-${option.value}`"
            :value="option.value"
            :disabled="option.disabled || props.disabled"
            :class="cn(sizeClasses[props.size], '!fill-yellow-600 text-yellow-600')"
          />
          <label
            :for="`${props.name}-${option.value}`"
            :class="
              cn(
                'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                option.disabled || props.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
              )
            "
          >
            {{ option.label }}
          </label>
        </div>
      </RadioGroup>
    </FormControl>

    <FormDescription v-if="props.description" :name="props.name" :id="`${props.name}-description`">
      {{ props.description }}
    </FormDescription>

    <FormMessage :name="props.name" />
  </FormItem>
</template>
