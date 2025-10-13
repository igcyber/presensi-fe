<script setup lang="ts">
import { nextTick, ref } from "vue";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  autoResize?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxlength?: number;
  minlength?: number;
  showCounter?: boolean;
  description?: string;
  spellcheck?: boolean;
  customCss?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  autoResize: false,
  required: false,
  disabled: false,
  readonly: false,
  showCounter: false,
  spellcheck: true,
});

const textareaRef = ref<HTMLTextAreaElement>();

const handleAutoResize = async (e: Event) => {
  if (!props.autoResize) return;

  const el = e.target as HTMLTextAreaElement;
  el.style.height = "auto";

  await nextTick();

  // Set minimum height based on rows prop
  const minHeight = props.rows * 24; // approximate line height
  const newHeight = Math.max(el.scrollHeight, minHeight);
  el.style.height = `${newHeight}px`;
};

const handleInput = (e: Event, componentFieldOnInput: (e: Event) => void) => {
  handleAutoResize(e);
  componentFieldOnInput(e);
};
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <Textarea
          ref="textareaRef"
          v-bind="componentField"
          :rows="props.rows"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :maxlength="props.maxlength"
          :minlength="props.minlength"
          :spellcheck="props.spellcheck"
          :aria-describedby="props.description ? `${props.name}-description` : undefined"
          :style="props.autoResize ? { resize: 'none', overflow: 'hidden' } : {}"
          @input="(e: Event) => handleInput(e, componentField.onInput)"
          :class="props.customCss"
        />
      </FormControl>
      <p v-if="props.description" :id="`${props.name}-description`" class="text-muted-foreground text-sm">
        {{ props.description }}
      </p>
      <div v-if="props.showCounter && props.maxlength" class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">
          {{ String((componentField.modelValue as string)?.length || 0) }}/{{ props.maxlength }}
        </span>
        <span
          v-if="props.maxlength && (componentField.modelValue as string)?.length > props.maxlength * 0.9"
          class="text-warning"
        >
          Mendekati batas maksimal
        </span>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
