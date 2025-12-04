<script setup lang="ts">
import { Eye, FileIcon, Upload, X } from "lucide-vue-next";
import { useField } from "vee-validate";
import { computed, onUnmounted, provide, ref, watch } from "vue";
import { toast } from "vue-sonner";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FIELD_NAME_CONTEXT_KEY } from "@/components/ui/form/useFormField";

import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";

interface Props {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  previewType?: "image" | "file" | "both";
  description?: string;
  existingFiles?: string | string[];
  enableFilePreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  accept: "image/*",
  multiple: false,
  maxSize: 5,
  maxFiles: 10,
  disabled: false,
  showPreview: true,
  previewType: "image",
  enableFilePreview: true,
});

provide(FIELD_NAME_CONTEXT_KEY, props.name);

const { errorMessage, setValue, meta } = useField(props.name);

const { fileSize } = useFormatters();
const filePreview = useFilePreview();

const fileInputRef = ref<HTMLInputElement>();
const dragOver = ref(false);
const files = ref<File[]>([]);
const previews = ref<string[]>([]);
const existingPreviews = ref<string[]>([]);
const showExisting = ref(true);

const acceptedTypes = computed(() => {
  if (props.accept === "image/*,application/pdf,video/*") return "PNG, JPG, GIF, PDF, MP4, WebM";
  if (props.accept === "image/*") return "PNG, JPG, GIF";
  if (props.accept.includes("pdf")) return "PDF";
  if (props.accept.includes("video/*")) return "MP4, WebM";
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

const validateFiles = (newFiles: File[]): string | null => {
  const oversized = newFiles.filter((file) => file.size > props.maxSize * 1024 * 1024);
  if (oversized.length) {
    return `File terlalu besar: ${oversized.map((f) => f.name).join(", ")}. Maksimal ${props.maxSize}MB`;
  }

  if (props.multiple && files.value.length + newFiles.length > props.maxFiles) {
    return `Maksimal ${props.maxFiles} file yang dapat diupload`;
  }

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

const handleFiles = (newFiles: File[]) => {
  const error = validateFiles(newFiles);
  if (error) {
    toast.error(error);
    return;
  }

  revokePreviews();
  files.value = props.multiple ? [...files.value, ...newFiles] : newFiles;

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
  setValue(result, false);
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    handleFiles(Array.from(target.files));
    target.value = "";
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;
  if (e.dataTransfer?.files) {
    handleFiles(Array.from(e.dataTransfer.files));
  }
};

const removeFile = (index: number) => {
  if (previews.value[index]) {
    URL.revokeObjectURL(previews.value[index]);
  }

  files.value.splice(index, 1);
  previews.value.splice(index, 1);

  if (files.value.length === 0 && hasExistingFiles.value) {
    showExisting.value = true;
  }

  const result = props.multiple ? (files.value.length ? files.value : null) : files.value[0] || null;
  setValue(result, false);
};

const removeExistingFile = (index: number) => {
  if (Array.isArray(props.existingFiles)) {
    existingPreviews.value.splice(index, 1);
  } else {
    showExisting.value = false;
  }
};

const openFileDialog = () => {
  if (!props.disabled) {
    fileInputRef.value?.click();
  }
};

const previewExistingFile = (url: string, index: number) => {
  if (!props.enableFilePreview) return;

  const fileName = typeof props.existingFiles === "string" ? "File saat ini" : `File ${index + 1}`;

  if (url.toLowerCase().includes(".pdf")) {
    filePreview.previewPDF(url, fileName);
  } else if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url.toLowerCase())) {
    filePreview.previewImage(url, fileName);
  } else if (/\.(mp4|webm|ogg|avi|mov)$/i.test(url.toLowerCase())) {
    filePreview.previewVideo(url, fileName);
  } else {
    filePreview.previewFile({
      url,
      name: fileName,
    });
  }
};

const previewNewFile = (file: File, _index: number) => {
  if (!props.enableFilePreview) return;

  const fileUrl = URL.createObjectURL(file);

  filePreview.previewFile(
    {
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
    },
    {
      title: `Preview: ${file.name}`,
    },
  );
};

watch(
  () => props.name,
  () => {
    files.value = [];
    revokePreviews();
    showExisting.value = true;
  },
);

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

onUnmounted(revokePreviews);
</script>

<template>
  <FormItem>
    <FormLabel :name="props.name" :custom-for="props.name">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">*</span>
    </FormLabel>

    <FormControl :name="props.name">
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
          @change="handleFileSelect"
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
          @drop="handleDrop"
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
              class="bg-muted/20 flex flex-col gap-3 rounded-lg border border-dashed p-3 sm:flex-row sm:items-center"
            >
              <!-- Preview -->
              <div class="flex-shrink-0 self-center sm:self-auto">
                <img
                  v-if="
                    preview &&
                    (preview.includes('.jpg') ||
                      preview.includes('.jpeg') ||
                      preview.includes('.png') ||
                      preview.includes('.gif'))
                  "
                  :src="preview"
                  :alt="`Existing file ${i + 1}`"
                  class="h-16 w-16 cursor-pointer rounded border object-cover hover:opacity-80 sm:h-12 sm:w-12"
                  @error="() => {}"
                  @click="previewExistingFile(preview, i)"
                />
                <div
                  v-else
                  class="bg-muted hover:bg-muted/80 flex h-16 w-16 cursor-pointer items-center justify-center rounded border sm:h-12 sm:w-12"
                  @click="previewExistingFile(preview, i)"
                >
                  <FileIcon class="text-muted-foreground h-8 w-8 sm:h-6 sm:w-6" />
                </div>
              </div>

              <!-- File Info -->
              <div class="min-w-0 flex-1 text-center sm:text-left">
                <p class="text-muted-foreground truncate text-sm font-medium">
                  {{ typeof props.existingFiles === "string" ? "File saat ini" : `File ${i + 1}` }}
                </p>
                <p class="text-muted-foreground text-xs">File yang sudah ada</p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-center gap-2 sm:gap-1">
                <!-- Preview Button -->
                <button
                  v-if="enableFilePreview"
                  type="button"
                  class="hover:bg-primary/10 text-primary hover:text-primary/80 flex-shrink-0 rounded-full p-2 transition-colors sm:p-1"
                  @click="previewExistingFile(preview, i)"
                  :aria-label="`Preview file ${i + 1}`"
                  :disabled="props.disabled"
                >
                  <Eye class="h-5 w-5 sm:h-4 sm:w-4" />
                </button>

                <!-- Remove Button -->
                <button
                  type="button"
                  class="hover:bg-destructive/10 text-destructive hover:text-destructive/80 flex-shrink-0 rounded-full p-2 transition-colors sm:p-1"
                  @click="removeExistingFile(i)"
                  :aria-label="`Hapus file existing ${i + 1}`"
                  :disabled="props.disabled"
                >
                  <X class="h-5 w-5 sm:h-4 sm:w-4" />
                </button>
              </div>
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
              class="bg-muted/30 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
            >
              <!-- Preview -->
              <div class="flex-shrink-0 self-center sm:self-auto">
                <img
                  v-if="previews[i] && (props.previewType === 'image' || props.previewType === 'both')"
                  :src="previews[i]"
                  :alt="file.name"
                  class="h-16 w-16 cursor-pointer rounded border object-cover hover:opacity-80 sm:h-12 sm:w-12"
                  @click="previewNewFile(file, i)"
                />
                <div
                  v-else
                  class="bg-muted hover:bg-muted/80 flex h-16 w-16 cursor-pointer items-center justify-center rounded border sm:h-12 sm:w-12"
                  @click="previewNewFile(file, i)"
                >
                  <FileIcon class="text-muted-foreground h-8 w-8 sm:h-6 sm:w-6" />
                </div>
              </div>

              <!-- File Info -->
              <div class="min-w-0 flex-1 text-center sm:text-left">
                <p class="truncate text-sm font-medium" :title="file.name">{{ file.name }}</p>
                <p class="text-muted-foreground text-xs">{{ fileSize(file.size) }}</p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-center gap-2 sm:gap-1">
                <!-- Preview Button -->
                <button
                  v-if="enableFilePreview && filePreview.canPreview({ url: '', type: file.type })"
                  type="button"
                  class="hover:bg-primary/10 text-primary hover:text-primary/80 flex-shrink-0 rounded-full p-2 transition-colors sm:p-1"
                  @click="previewNewFile(file, i)"
                  :aria-label="`Preview file ${file.name}`"
                  :disabled="props.disabled"
                >
                  <Eye class="h-5 w-5 sm:h-4 sm:w-4" />
                </button>

                <!-- Remove Button -->
                <button
                  type="button"
                  class="hover:bg-destructive/10 text-destructive hover:text-destructive/80 flex-shrink-0 rounded-full p-2 transition-colors sm:p-1"
                  @click="removeFile(i)"
                  :aria-label="`Hapus file ${file.name}`"
                  :disabled="props.disabled"
                >
                  <X class="h-5 w-5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormControl>

    <FormMessage :name="props.name" />
  </FormItem>

  <!-- File Preview Dialog -->
  <FilePreviewDialog
    v-model:open="filePreview.isOpen.value"
    :file="filePreview.currentFile.value"
    :title="filePreview.options.value.title"
    :show-download="filePreview.options.value.showDownload ?? true"
    :show-external-link="filePreview.options.value.showExternalLink ?? true"
    :show-file-info="filePreview.options.value.showFileInfo ?? true"
    :max-width="filePreview.options.value.maxWidth"
    :max-height="filePreview.options.value.maxHeight"
    @download="filePreview.handleDownload"
    @external-link="filePreview.handleExternalLink"
  />
</template>
