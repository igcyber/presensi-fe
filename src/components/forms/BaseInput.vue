<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { useField } from "vee-validate";
import { computed, provide, ref } from "vue";
import type { HTMLAttributes } from "vue";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  min?: number;
  max?: number;
  step?: number;
  maxlength?: number;
  minlength?: number;
  pattern?: string;
  description?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  readonly: false,
  required: false,
});

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const autocompleteValue = computed(() => {
  if (props.autocomplete) return props.autocomplete;

  switch (props.type) {
    case "password":
      return "current-password";
    case "email":
      return "email";
    case "tel":
      return "tel";
    case "url":
      return "url";
    case "date":
      return "date";
    default:
      return "on";
  }
});

const handleChange = (val: string | number | undefined) => {
  setValue(val, false);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <FormItem class="relative">
    <FormLabel :name="props.name">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>
    <FormControl :name="props.name">
      <Input
        :model-value="(value as string | number | undefined) ?? ''"
        @update:model-value="handleChange"
        :type="inputType"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :maxlength="props.maxlength"
        :minlength="props.minlength"
        :pattern="props.pattern"
        :autocomplete="autocompleteValue"
        :aria-invalid="!!errorMessage"
        :aria-describedby="props.description ? `${props.name}-description` : undefined"
        :class="cn(props.type === 'password' ? 'pr-10' : '', props.class)"
      />

      <Button
        v-if="props.type === 'password'"
        type="button"
        variant="ghost"
        size="sm"
        class="absolute inset-y-5.5 right-0 flex items-center px-3 hover:bg-transparent"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
        :aria-pressed="showPassword"
        :disabled="props.disabled"
      >
        <EyeOff v-if="showPassword" class="h-4 w-4" />
        <Eye v-else class="h-4 w-4" />
      </Button>
    </FormControl>

    <FormDescription v-if="props.description" :name="props.name" :id="`${props.name}-description`">
      {{ props.description }}
    </FormDescription>

    <FormMessage :name="props.name" />
  </FormItem>
</template>
