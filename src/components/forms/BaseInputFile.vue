<script setup lang="ts">
import { Upload } from "lucide-vue-next";
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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    handleFiles(Array.from(files));
  }
};

const handleFiles = (files: File[]) => {
  // Validate file size
  const oversizedFiles = files.filter((file) => file.size > props.maxSize * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    toast.error(`File terlalu besar. Maksimal ${props.maxSize}MB`);
    return;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFiles(Array.from(files));
  }
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

// const removeFile = (index: number) => {
//   // Handle file removal
//   console.log("Remove file at index:", index);
// };
</script>

<template>
  <FormField :name="props.name" v-slot="{}">
    <FormItem>
      <FormLabel>
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
            class="hidden"
            @change="handleFileSelect"
          />

          <!-- Drop Zone -->
          <div
            class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400"
            :class="{
              'border-blue-500 bg-blue-50': dragOver,
              'border-red-500 bg-red-50': false, // Add error state logic
            }"
            @click="openFileDialog"
            @drop="handleDrop"
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
                {{ props.accept === "image/*" ? "PNG, JPG, GIF" : "Semua file" }}
                hingga {{ props.maxSize }}MB
              </p>
            </div>
          </div>

          <!-- File Preview -->
          <div v-if="props.showPreview" class="space-y-2">
            <!-- Placeholder for file previews -->
            <div class="text-sm text-gray-500">File preview akan muncul di sini</div>
          </div>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
