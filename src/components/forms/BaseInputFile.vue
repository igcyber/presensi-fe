<script setup lang="ts">
import { Upload, X } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
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

// state file + preview
const files = ref<File[]>([]);
const previews = ref<string[]>([]);

const handleFiles = (newFiles: File[], onChange: (val: File[] | File | null) => void) => {
  // Validate file size
  const oversized = newFiles.filter((file) => file.size > props.maxSize * 1024 * 1024);
  if (oversized.length > 0) {
    toast.error(`File terlalu besar. Maksimal ${props.maxSize}MB`);
    return;
  }

  // Simpan ke state
  files.value = props.multiple ? [...files.value, ...newFiles] : newFiles;

  // Buat URL preview
  if (props.showPreview) {
    previews.value = files.value.map((f) => URL.createObjectURL(f));
  }

  // Update ke form store (vee-validate)
  if (props.multiple) {
    onChange(files.value.length > 0 ? files.value : null);
  } else {
    onChange(files.value[0] || null);
  }
};

const handleFileSelect = (event: Event, onChange: (val: any) => void) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  handleFiles(Array.from(target.files), onChange);
};

const handleDrop = (event: DragEvent, onChange: (val: any) => void) => {
  event.preventDefault();
  dragOver.value = false;
  const fileList = event.dataTransfer?.files;
  if (fileList) handleFiles(Array.from(fileList), onChange);
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = () => {
  dragOver.value = false;
};

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const removeFile = (index: number, onChange: (val: any) => void) => {
  files.value.splice(index, 1);
  previews.value.splice(index, 1);

  if (props.multiple) {
    onChange(files.value.length > 0 ? files.value : null); // ⬅️ kirim null kalau kosong
  } else {
    onChange(files.value[0] || null);
  }
};
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField }">
    {{ componentField }}
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </FormLabel>

      <FormControl>
        <div class="space-y-4">
          <!-- File Input (Hidden) -->
          <input
            ref="fileInputRef"
            type="file"
            :accept="props.accept"
            :multiple="props.multiple"
            :id="props.name"
            class="hidden"
            @change="(e) => handleFileSelect(e, componentField.onChange)"
          />

          <!-- Drop Zone -->
          <div
            class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400"
            :class="{ 'border-blue-500 bg-blue-50': dragOver }"
            @click="openFileDialog"
            @drop="(e) => handleDrop(e, componentField.onChange)"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
          >
            <div class="flex flex-col items-center space-y-2">
              <Upload class="h-8 w-8 text-gray-400" />
              <div class="text-sm text-gray-600">
                <span class="font-medium text-blue-600 hover:text-blue-500"> Klik untuk upload </span>
                atau drag & drop
              </div>
              <p class="text-xs text-gray-500">
                {{ props.accept === "image/*" ? "PNG, JPG, GIF" : "Semua file" }} hingga {{ props.maxSize }}MB
              </p>
            </div>
          </div>

          <!-- File Preview -->
          <div v-if="props.showPreview && previews.length" class="space-y-2">
            <div v-for="(src, index) in previews" :key="index" class="relative inline-block">
              <img v-if="props.previewType !== 'file'" :src="src" class="h-20 w-20 rounded border object-cover" />
              <div v-else class="flex h-20 w-20 items-center justify-center rounded border bg-gray-100 text-xs">
                {{ files[index].name }}
              </div>
              <button
                type="button"
                class="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
                @click="removeFile(index, componentField.onChange)"
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
