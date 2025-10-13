<script setup lang="ts">
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
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
};

const orientationClasses = {
  horizontal: "flex flex-row flex-wrap gap-4",
  vertical: "flex flex-col space-y-3",
};
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, errorMessage }">
    <FormItem>
      <FormLabel :for="props.name" :class="{ 'cursor-not-allowed opacity-70': props.disabled }">
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>

      <FormControl>
        <RadioGroup
          :id="props.name"
          v-bind="componentField"
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
              :class="sizeClasses[props.size] + ' !fill-yellow-600 text-yellow-600'"
            />
            <label
              :for="`${props.name}-${option.value}`"
              class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              :class="{
                'cursor-not-allowed opacity-70': option.disabled || props.disabled,
                'cursor-pointer': !option.disabled && !props.disabled,
              }"
            >
              {{ option.label }}
            </label>
          </div>
        </RadioGroup>
      </FormControl>

      <FormDescription v-if="props.description">
        {{ props.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
