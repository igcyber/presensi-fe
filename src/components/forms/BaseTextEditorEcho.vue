<script setup lang="ts">
import { defineAsyncComponent } from "vue";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Lazy load TextEditor untuk performa yang lebih baik
const TextEditor = defineAsyncComponent(() => import("@/components/ui/text-editor/TextEditor.vue"));

interface Props {
  name: string;
  label: string;
  hideToolbar?: boolean;
  hideMenubar?: boolean;
  required?: boolean;
  disabled?: boolean;
  uploadUrl?: string;
  description?: string;
  placeholder?: string;
  localeCustom?: string;
  maxLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  hideToolbar: false,
  hideMenubar: false,
  placeholder: "Mulai menulis...",
  localeCustom: "en",
});
</script>

<template>
  <FormField v-slot="{ componentField, errorMessage }" :name="props.name">
    <FormItem class="relative">
      <FormLabel>
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <!-- TextEditor yang di-lazy load -->
        <Suspense>
          <TextEditor
            v-model="componentField.modelValue"
            :upload-url="props.uploadUrl"
            :hide-toolbar="props.hideToolbar"
            :hide-menubar="props.hideMenubar"
            :placeholder="props.placeholder"
            :locale-custom="props.localeCustom"
            :error="errorMessage"
            @update:modelValue="componentField.onChange"
          />
          <template #fallback>
            <div class="border-ring/50 flex min-h-[200px] items-center justify-center rounded-md border p-3">
              <div class="text-muted-foreground text-sm">Memuat editor...</div>
            </div>
          </template>
        </Suspense>
      </FormControl>

      <FormDescription v-if="props.description">
        {{ props.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
