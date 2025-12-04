<script setup lang="ts">
import { Eye } from "lucide-vue-next";
import { useField } from "vee-validate";
import { defineAsyncComponent, provide, ref } from "vue";

import Button from "@/components/ui/button/Button.vue";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";

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

const TextEditor = defineAsyncComponent(() => import("@/components/ui/text-editor/TextEditor.vue"));

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { value, errorMessage, setValue } = useField(props.name);

const textEditorRef = ref<InstanceType<typeof TextEditor>>();

const handleChange = (val: string) => {
  setValue(val, false);
};

const openCustomPreview = () => {
  textEditorRef.value?.openCustomPreview();
};
</script>

<template>
  <FormItem class="relative">
    <FormLabel :name="props.name">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>
    <FormControl :name="props.name">
      <!-- TextEditor yang di-lazy load -->
      <Suspense>
        <TextEditor
          ref="textEditorRef"
          :model-value="value as string"
          :upload-url="props.uploadUrl"
          :hide-toolbar="props.hideToolbar"
          :hide-menubar="props.hideMenubar"
          :placeholder="props.placeholder"
          :locale-custom="props.localeCustom"
          :error="errorMessage"
          @update:modelValue="handleChange"
        />
        <template #fallback>
          <div class="border-ring/50 flex min-h-[200px] items-center justify-center rounded-md border p-3">
            <div class="text-muted-foreground text-sm">Memuat editor...</div>
          </div>
        </template>
      </Suspense>
    </FormControl>

    <FormDescription :name="props.name">
      <div class="mt-2">
        <Button variant="default" size="sm" title="Preview (Ctrl+Shift+P)" @click="openCustomPreview">
          <Eye class="h-4 w-4" />
          Pratinjau
        </Button>
      </div>
    </FormDescription>

    <FormMessage :name="props.name" />
  </FormItem>
</template>
