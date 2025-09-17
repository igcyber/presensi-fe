<script setup lang="ts">
import { FileIcon, Upload, X } from "lucide-vue-next";
import { computed, onUnmounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useFormatters } from "@/composables/useFormatters";

// Interface Props
interface Props {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  previewType?: "image" | "file" | "both";
  description?: string;
  existingFiles?: string | string[]; // URL atau array URL untuk file yang sudah ada
}

// Props dengan default values
const props = withDefaults(defineProps<Props>(), {
  accept: "image/*",
  multiple: false,
  maxSize: 5,
  maxFiles: 10,
  disabled: false,
  showPreview: true,
  previewType: "image",
});

// Reactive references
const fileInputRef = ref<HTMLInputElement>();
const dragOver = ref(false);
const files = ref<File[]>([]);
const previews = ref<string[]>([]);
const existingPreviews = ref<string[]>([]);
const showExisting = ref(true);

// composables
const { fileSize } = useFormatters();

// Computed properties
const acceptedTypes = computed(() => {
  if (props.accept === "image/*") return "PNG, JPG, GIF";
  if (props.accept.includes("pdf")) return "PDF";
  return "Semua file";
});

const hasExistingFiles = computed(() => {
  return (
    props.existingFiles &&
    ((typeof props.existingFiles === "string" && props.existingFiles.length > 0) ||
      (Array.isArray(props.existingFiles) && props.existingFiles.length > 0))
  );
});

const revokePreviews = () => {
  previews.value.forEach((src) => URL.revokeObjectURL(src));
  previews.value = [];
};

// Validation functions
const validateFiles = (newFiles: File[]): string | null => {
  // Check file size
  const oversized = newFiles.filter((file) => file.size > props.maxSize * 1024 * 1024);
  if (oversized.length) {
    return `File terlalu besar: ${oversized.map((f) => f.name).join(", ")}. Maksimal ${props.maxSize}MB`;
  }

  // Check max files limit
  if (props.multiple && files.value.length + newFiles.length > props.maxFiles) {
    return `Maksimal ${props.maxFiles} file yang dapat diupload`;
  }

  // Check file type
  if (props.accept && props.accept !== "*/*") {
    const acceptedExtensions = props.accept.split(",").map((ext) => ext.trim());
    const invalidFiles = newFiles.filter((file) => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      return !acceptedExtensions.some((accepted) => {
        if (accepted.startsWith(".")) {
          return fileName.endsWith(accepted.toLowerCase());
        }
        if (accepted.includes("/*")) {
          return fileType.startsWith(accepted.replace("/*", ""));
        }
        return fileType === accepted;
      });
    });

    if (invalidFiles.length) {
      return `Tipe file tidak didukung: ${invalidFiles.map((f) => f.name).join(", ")}`;
    }
  }

  return null;
};

// File handling functions
const handleFiles = (newFiles: File[], onChange: (val: File[] | File | null) => void) => {
  const error = validateFiles(newFiles);
  if (error) {
    toast.error(error);
    return;
  }

  revokePreviews();
  files.value = props.multiple ? [...files.value, ...newFiles] : newFiles;

  // Hide existing files when new files are selected
  if (newFiles.length > 0) {
    showExisting.value = false;
  }

  if (props.showPreview) {
    previews.value = files.value.map((f) => {
      if (f.type.startsWith("image/")) {
        return URL.createObjectURL(f);
      }
      return "";
    });
  }

  const result = props.multiple ? (files.value.length ? files.value : null) : files.value[0] || null;
  onChange(result);
};

const handleFileSelect = (e: Event, onChange: (val: any) => void) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    handleFiles(Array.from(target.files), onChange);
    // Reset input to allow selecting same file again
    target.value = "";
  }
};

const handleDrop = (e: DragEvent, onChange: (val: any) => void) => {
  e.preventDefault();
  dragOver.value = false;
  if (e.dataTransfer?.files) {
    handleFiles(Array.from(e.dataTransfer.files), onChange);
  }
};

const removeFile = (index: number, onChange: (val: any) => void) => {
  if (previews.value[index]) {
    URL.revokeObjectURL(previews.value[index]);
  }

  files.value.splice(index, 1);
  previews.value.splice(index, 1);

  // Show existing files again if no new files
  if (files.value.length === 0 && hasExistingFiles.value) {
    showExisting.value = true;
  }

  const result = props.multiple ? (files.value.length ? files.value : null) : files.value[0] || null;
  onChange(result);
};

const removeExistingFile = (index: number) => {
  if (Array.isArray(props.existingFiles)) {
    // Remove from existing files array (this should be handled by parent component)
    // For now, just hide the preview
    existingPreviews.value.splice(index, 1);
  } else {
    // Single file, hide it
    showExisting.value = false;
  }
};

const openFileDialog = () => {
  if (!props.disabled) {
    fileInputRef.value?.click();
  }
};

// Watchers
watch(
  () => props.name,
  () => {
    // Reset files when form resets
    files.value = [];
    revokePreviews();
    showExisting.value = true;
  },
);

// Initialize existing files preview
watch(
  () => props.existingFiles,
  (newFiles) => {
    if (newFiles) {
      if (typeof newFiles === "string") {
        existingPreviews.value = [newFiles];
      } else if (Array.isArray(newFiles)) {
        existingPreviews.value = newFiles;
      }
    } else {
      existingPreviews.value = [];
    }
  },
  { immediate: true },
);

// Lifecycle hooks
onUnmounted(revokePreviews);
</script>

<template>
  <FormField :name="props.name" v-slot="{ componentField, meta, errorMessage }">
    <FormItem>
      <FormLabel :custom-for="props.name">
        {{ props.label }}
        <span v-if="props.required" class="text-destructive">*</span>
      </FormLabel>

      <FormControl>
        <div class="space-y-4">
          <input
            ref="fileInputRef"
            type="file"
            :accept="props.accept"
            :multiple="props.multiple"
            :disabled="props.disabled"
            :id="props.name"
            class="hidden"
            :aria-describedby="props.description ? `${props.name}-description` : undefined"
            @change="(e) => handleFileSelect(e, componentField.onChange)"
          />

          <div
            class="border-ring/50 hover:border-ring/80 rounded-lg border-2 border-dashed p-6 text-center transition-colors"
            :class="{
              'border-blue-500 bg-blue-50 dark:bg-blue-950/20': dragOver,
              '!border-destructive !bg-destructive/10': meta.valid === false && errorMessage,
              'cursor-pointer': !props.disabled,
              'cursor-not-allowed opacity-50': props.disabled,
            }"
            @click="openFileDialog"
            @drop="(e) => handleDrop(e, componentField.onChange)"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @dragenter.prevent
            :tabindex="props.disabled ? -1 : 0"
            @keydown.enter="openFileDialog"
            @keydown.space.prevent="openFileDialog"
            role="button"
            :aria-label="`Upload ${props.label}`"
          >
            <div class="flex flex-col items-center space-y-2">
              <Upload class="text-muted-foreground h-8 w-8" />
              <div class="text-muted-foreground text-sm">
                <span class="text-primary font-medium"> Klik untuk upload </span> atau drag & drop
              </div>
              <div class="text-muted-foreground text-xs">
                {{ acceptedTypes }} hingga {{ props.maxSize }}MB
                <span v-if="props.multiple"> (maksimal {{ props.maxFiles }} file)</span>
              </div>
            </div>
          </div>

          <p v-if="props.description" :id="`${props.name}-description`" class="text-muted-foreground text-sm">
            {{ props.description }}
          </p>

          <!-- Existing Files Preview -->
          <div v-if="hasExistingFiles && showExisting" class="space-y-2">
            <h4 class="text-sm font-medium">File saat ini:</h4>
            <div class="max-h-48 space-y-2 overflow-y-auto">
              <div
                v-for="(preview, i) in existingPreviews"
                :key="`existing-${i}`"
                class="bg-muted/20 flex items-center gap-3 rounded-lg border border-dashed p-3"
              >
                <!-- Preview -->
                <div class="flex-shrink-0">
                  <img
                    v-if="
                      preview &&
                      (props.accept.includes('image') || props.previewType === 'image' || props.previewType === 'both')
                    "
                    :src="preview"
                    :alt="`Existing file ${i + 1}`"
                    class="h-12 w-12 rounded border object-cover"
                    @error="() => {}"
                  />
                  <div v-else class="bg-muted flex h-12 w-12 items-center justify-center rounded border">
                    <FileIcon class="text-muted-foreground h-6 w-6" />
                  </div>
                </div>

                <!-- File Info -->
                <div class="min-w-0 flex-1">
                  <p class="text-muted-foreground truncate text-sm font-medium">
                    {{ typeof props.existingFiles === "string" ? "File saat ini" : `File ${i + 1}` }}
                  </p>
                  <p class="text-muted-foreground text-xs">File yang sudah ada</p>
                </div>

                <!-- Remove Button -->
                <button
                  type="button"
                  class="hover:bg-destructive/10 text-destructive hover:text-destructive/80 flex-shrink-0 rounded-full p-1 transition-colors"
                  @click="removeExistingFile(i)"
                  :aria-label="`Hapus file existing ${i + 1}`"
                  :disabled="props.disabled"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- New Files List -->
          <div v-if="files.length" class="space-y-2">
            <h4 class="text-sm font-medium">File baru yang dipilih:</h4>
            <div class="max-h-48 space-y-2 overflow-y-auto">
              <div
                v-for="(file, i) in files"
                :key="`${file.name}-${i}`"
                class="bg-muted/30 flex items-center gap-3 rounded-lg border p-3"
              >
                <!-- Preview -->
                <div class="flex-shrink-0">
                  <img
                    v-if="previews[i] && (props.previewType === 'image' || props.previewType === 'both')"
                    :src="previews[i]"
                    :alt="file.name"
                    class="h-12 w-12 rounded border object-cover"
                  />
                  <div v-else class="bg-muted flex h-12 w-12 items-center justify-center rounded border">
                    <FileIcon class="text-muted-foreground h-6 w-6" />
                  </div>
                </div>

                <!-- File Info -->
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium" :title="file.name">{{ file.name }}</p>
                  <p class="text-muted-foreground text-xs">{{ fileSize(file.size) }}</p>
                </div>

                <!-- Remove Button -->
                <button
                  type="button"
                  class="hover:bg-destructive/10 text-destructive hover:text-destructive/80 flex-shrink-0 rounded-full p-1 transition-colors"
                  @click="removeFile(i, componentField.onChange)"
                  :aria-label="`Hapus file ${file.name}`"
                  :disabled="props.disabled"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
