<script setup lang="ts">
import { useField } from "vee-validate";
import { nextTick, provide, ref } from "vue";
import type { HTMLAttributes } from "vue";

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

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
  class?: HTMLAttributes["class"];
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

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const textareaRef = ref<HTMLTextAreaElement>();

const handleAutoResize = async (e: Event) => {
  if (!props.autoResize) return;

  const el = e.target as HTMLTextAreaElement;
  el.style.height = "auto";

  await nextTick();

  const minHeight = props.rows * 24;
  const newHeight = Math.max(el.scrollHeight, minHeight);
  el.style.height = `${newHeight}px`;
};

const handleChange = (val: string) => {
  setValue(val, false);
};

const handleInput = (e: Event) => {
  handleAutoResize(e);
  const target = e.target as HTMLTextAreaElement;
  setValue(target.value, false);
};
</script>

<template>
  <FormItem>
    <FormLabel :name="props.name">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>
    <FormControl :name="props.name">
      <Textarea
        ref="textareaRef"
        :model-value="(value as string) ?? ''"
        @update:model-value="(payload: string | number) => handleChange(String(payload))"
        :rows="props.rows"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :maxlength="props.maxlength"
        :minlength="props.minlength"
        :spellcheck="props.spellcheck"
        :aria-invalid="!!errorMessage"
        :aria-describedby="props.description ? `${props.name}-description` : undefined"
        :style="props.autoResize ? { resize: 'none', overflow: 'hidden' } : {}"
        :class="cn(props.class)"
        @input="handleInput"
      />
    </FormControl>
    <FormDescription v-if="props.description" :name="props.name" :id="`${props.name}-description`">
      {{ props.description }}
    </FormDescription>
    <div v-if="props.showCounter && props.maxlength" class="flex items-center justify-between text-xs">
      <span class="text-muted-foreground"> {{ String((value as string)?.length || 0) }}/{{ props.maxlength }} </span>
      <span v-if="props.maxlength && (value as string)?.length > props.maxlength * 0.9" class="text-warning">
        Mendekati batas maksimal
      </span>
    </div>
    <FormMessage :name="props.name" />
  </FormItem>
</template>
