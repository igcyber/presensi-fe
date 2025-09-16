<script setup lang="ts">
// Import dependencies
import { Eye } from "lucide-vue-next";
import { defineAsyncComponent, ref } from "vue";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Interface definitions
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

// Component definitions
// Lazy load TextEditor untuk performa yang lebih baik
const TextEditor = defineAsyncComponent(() => import("@/components/ui/text-editor/TextEditor.vue"));

// Props
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  hideToolbar: false,
  hideMenubar: false,
  placeholder: "Mulai menulis...",
  localeCustom: "en",
});

// Reactive state
const textEditorRef = ref<InstanceType<typeof TextEditor>>();

// Methods
const openCustomPreview = () => {
  textEditorRef.value?.openCustomPreview();
};
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
            ref="textEditorRef"
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

      <FormDescription>
        <div class="mt-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            title="Preview (Ctrl+Shift+P)"
            @click="openCustomPreview"
          >
            <Eye class="h-4 w-4" />
            Pratinjau
          </button>
        </div>
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
