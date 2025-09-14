<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  min?: number;
  max?: number;
  step?: number;
  maxlength?: number;
  pattern?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  readonly: false,
});

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
    default:
      return "on";
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <FormField v-slot="{ componentField }" :name="props.name">
    <FormItem class="relative">
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Input
          v-bind="componentField"
          :type="inputType"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :min="props.min"
          :max="props.max"
          :step="props.step"
          :maxlength="props.maxlength"
          :pattern="props.pattern"
          :autocomplete="autocompleteValue"
          :class="props.type === 'password' ? 'pr-10' : ''"
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

      <FormDescription v-if="props.description">
        {{ props.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
