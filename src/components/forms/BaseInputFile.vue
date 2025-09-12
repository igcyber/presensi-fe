<script setup lang="ts">
import { Upload, X } from "lucide-vue-next";
import { onUnmounted, ref } from "vue";
import { toast } from "vue-sonner";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  required?: boolean;
  showPreview?: boolean;
  previewType?: "image" | "file" | "both";
}

const props = withDefaults(defineProps<Props>(), {
  accept: "image/*",
  multiple: false,
  maxSize: 5,
  showPreview: true,
  previewType: "image",
});

const fileInputRef = ref<HTMLInputElement>();
const dragOver = ref(false);
const files = ref<File[]>([]);
const previews = ref<string[]>([]);

const revokePreviews = () => {
  previews.value.forEach((src) => URL.revokeObjectURL(src));
};

onUnmounted(revokePreviews);

const handleFiles = (newFiles: File[], onChange: (val: File[] | File | null) => void) => {
  const oversized = newFiles.filter((file) => file.size > props.maxSize * 1024 * 1024);
  if (oversized.length) {
    toast.error(`File terlalu besar. Maksimal ${props.maxSize}MB`);
    return;
  }

  revokePreviews();
  files.value = props.multiple ? [...files.value, ...newFiles] : newFiles;
  previews.value = props.showPreview ? files.value.map((f) => URL.createObjectURL(f)) : [];

  onChange(props.multiple ? (files.value.length ? files.value : null) : files.value[0] || null);
};

const handleFileSelect = (e: Event, onChange: (val: any) => void) => {
  const target = e.target as HTMLInputElement;
  if (target.files) handleFiles(Array.from(target.files), onChange);
};

const handleDrop = (e: DragEvent, onChange: (val: any) => void) => {
  e.preventDefault();
  dragOver.value = false;
  if (e.dataTransfer?.files) handleFiles(Array.from(e.dataTransfer.files), onChange);
};

const removeFile = (i: number, onChange: (val: any) => void) => {
  URL.revokeObjectURL(previews.value[i]);
  files.value.splice(i, 1);
  previews.value.splice(i, 1);
  onChange(props.multiple ? (files.value.length ? files.value : null) : files.value[0] || null);
};

const openFileDialog = () => fileInputRef.value?.click();
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }} <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>

      <FormControl>
        <div class="space-y-4">
          <input
            ref="fileInputRef"
            type="file"
            :accept="props.accept"
            :multiple="props.multiple"
            :id="props.name"
            class="hidden"
            @change="(e) => handleFileSelect(e, componentField.onChange)"
          />

          <div
            class="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-gray-400"
            :class="{
              'border-blue-500 bg-blue-50': dragOver,
              'border-destructive bg-destructive/10': meta.valid === false && errorMessage,
            }"
            @click="openFileDialog"
            @drop="(e) => handleDrop(e, componentField.onChange)"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            tabindex="0"
            @keyup.enter="openFileDialog"
          >
            <div class="flex flex-col items-center space-y-2">
              <Upload class="h-8 w-8 text-gray-400" />
              <div class="text-sm text-gray-600">
                <span class="font-medium text-blue-600"> Klik untuk upload </span> atau drag & drop
              </div>
            </div>
          </div>

          <FormDescription>
            {{ props.accept === "image/*" ? "PNG, JPG, GIF" : "Semua file" }} hingga {{ props.maxSize }}MB
          </FormDescription>

          <div v-if="props.showPreview && previews.length" class="space-y-2">
            <div v-for="(src, i) in previews" :key="i" class="relative inline-block">
              <img
                v-if="props.previewType === 'image' || props.previewType === 'both'"
                :src="src"
                class="h-20 w-20 rounded border object-cover"
              />
              <div
                v-if="props.previewType === 'file' || props.previewType === 'both'"
                class="flex h-20 w-20 items-center justify-center rounded border bg-gray-100 text-xs"
              >
                {{ files[i].name }}
              </div>
              <button
                type="button"
                class="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
                @click="removeFile(i, componentField.onChange)"
              >
                <X class="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
