<script setup lang="ts">
import { Download, ExternalLink, FileIcon, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-vue-next";
import { computed, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useFormatters } from "@/composables/useFormatters";

// Types
interface FilePreviewData {
  url: string;
  name?: string;
  size?: number;
  type?: string;
  lastModified?: string | Date;
  description?: string;
}

interface Props {
  open: boolean;
  file: FilePreviewData | null;
  title?: string;
  showDownload?: boolean;
  showExternalLink?: boolean;
  showFileInfo?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "download", file: FilePreviewData): void;
  (e: "external-link", file: FilePreviewData): void;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  title: "Preview File",
  showDownload: false,
  showExternalLink: true,
  showFileInfo: true,
  maxWidth: "95vw",
  maxHeight: "95vh",
});

// Emits
const emit = defineEmits<Emits>();

// Composables
const { fileSize, date } = useFormatters();

// State
const isFullscreen = ref(false);
const zoomLevel = ref(1);
const imageError = ref(false);

// Computed
const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const fileType = computed(() => {
  if (!props.file) return "unknown";

  const url = props.file.url.toLowerCase();
  const type = props.file.type?.toLowerCase() || "";

  // Image types
  if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) {
    return "image";
  }

  // Video types
  if (type.startsWith("video/") || /\.(mp4|webm|ogg|avi|mov|wmv|flv)$/i.test(url)) {
    return "video";
  }

  // Audio types
  if (type.startsWith("audio/") || /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(url)) {
    return "audio";
  }

  // PDF
  if (type === "application/pdf" || url.endsWith(".pdf")) {
    return "pdf";
  }

  // Text files
  if (type.startsWith("text/") || /\.(txt|md|json|xml|html|css|js|ts|vue)$/i.test(url)) {
    return "text";
  }

  // Office documents
  if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url)) {
    return "office";
  }

  return "unknown";
});

const fileName = computed(() => {
  if (!props.file) return "";
  return props.file.name || props.file.url.split("/").pop() || "Unknown File";
});

const fileExtension = computed(() => {
  const name = fileName.value;
  const lastDot = name.lastIndexOf(".");
  return lastDot > 0 ? name.substring(lastDot + 1).toUpperCase() : "";
});

// Methods
const handleDownload = () => {
  if (props.file) {
    emit("download", props.file);
  }
};

const handleExternalLink = () => {
  if (props.file) {
    emit("external-link", props.file);
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 3);
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.5);
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

const handleImageError = () => {
  imageError.value = true;
};

// Reset state when dialog closes or file changes
watch([open, () => props.file], ([newOpen, newFile], [_oldOpen, oldFile]) => {
  if (!newOpen || newFile !== oldFile) {
    isFullscreen.value = false;
    zoomLevel.value = 1;
    imageError.value = false;
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      :class="[
        'gap-0 p-0',
        isFullscreen ? 'h-[100vh] max-h-[100vh] w-[100vw] max-w-[100vw]' : `max-w-[${maxWidth}] max-h-[${maxHeight}]`,
      ]"
    >
      <!-- Header -->
      <DialogHeader class="flex flex-col space-y-2 p-4 pb-2">
        <DialogTitle class="flex-1 truncate text-left text-base sm:text-lg">
          {{ title }}
        </DialogTitle>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-1 sm:gap-2">
          <!-- Zoom controls for images -->
          <template v-if="fileType === 'image' && !imageError">
            <!-- Mobile: Compact zoom controls -->
            <div class="flex items-center gap-1 sm:hidden">
              <Button variant="ghost" size="sm" @click="zoomOut" :disabled="zoomLevel <= 0.5">
                <ZoomOut class="h-3 w-3" />
              </Button>
              <span class="min-w-[2rem] px-1 text-center text-xs">{{ Math.round(zoomLevel * 100) }}%</span>
              <Button variant="ghost" size="sm" @click="zoomIn" :disabled="zoomLevel >= 3">
                <ZoomIn class="h-3 w-3" />
              </Button>
            </div>

            <!-- Desktop: Full zoom controls -->
            <div class="hidden sm:flex sm:items-center sm:gap-1">
              <Button variant="ghost" size="sm" @click="zoomOut" :disabled="zoomLevel <= 0.5">
                <ZoomOut class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" @click="resetZoom" class="min-w-[3rem]">
                {{ Math.round(zoomLevel * 100) }}%
              </Button>
              <Button variant="ghost" size="sm" @click="zoomIn" :disabled="zoomLevel >= 3">
                <ZoomIn class="h-4 w-4" />
              </Button>
            </div>
          </template>

          <!-- Fullscreen toggle -->
          <Button variant="ghost" size="sm" @click="toggleFullscreen" class="shrink-0">
            <Maximize2 v-if="!isFullscreen" class="h-4 w-4" />
            <Minimize2 v-else class="h-4 w-4" />
            <span class="ml-1 hidden sm:inline">{{ isFullscreen ? "Exit" : "Fullscreen" }}</span>
          </Button>

          <!-- Download -->
          <Button v-if="showDownload" variant="ghost" size="sm" @click="handleDownload" class="shrink-0">
            <Download class="h-4 w-4" />
            <span class="ml-1 hidden sm:inline">Download</span>
          </Button>

          <!-- External link -->
          <Button v-if="showExternalLink" variant="ghost" size="sm" @click="handleExternalLink" class="shrink-0">
            <ExternalLink class="h-4 w-4" />
            <span class="ml-1 hidden sm:inline">Open</span>
          </Button>
        </div>
      </DialogHeader>

      <!-- Content -->
      <div class="flex min-h-0 flex-1 flex-col">
        <!-- Preview Area -->
        <div
          class="bg-muted/20 flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-4"
          :class="
            isFullscreen ? 'h-[calc(100vh-120px)]' : 'max-h-[50vh] min-h-[300px] sm:max-h-[60vh] sm:min-h-[400px]'
          "
        >
          <!-- Image Preview -->
          <div v-if="fileType === 'image' && !imageError" class="flex h-full w-full items-center justify-center">
            <img
              :src="file?.url"
              :alt="fileName"
              class="max-h-full max-w-full cursor-zoom-in object-contain transition-transform duration-200"
              :style="{ transform: `scale(${zoomLevel})` }"
              @error="handleImageError"
              @click="zoomLevel < 3 ? zoomIn() : resetZoom()"
            />
          </div>

          <!-- Video Preview -->
          <div v-else-if="fileType === 'video'" class="flex h-full w-full items-center justify-center">
            <video :src="file?.url" controls class="max-h-full max-w-full" preload="metadata">
              Browser Anda tidak mendukung tag video.
            </video>
          </div>

          <!-- Audio Preview -->
          <div v-else-if="fileType === 'audio'" class="flex w-full items-center justify-center px-2 sm:px-4">
            <div class="w-full max-w-sm sm:max-w-md">
              <div class="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
                <div class="bg-primary/10 text-primary rounded-lg p-2 sm:p-3">
                  <FileIcon class="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-medium sm:text-base">{{ fileName }}</h3>
                  <p class="text-muted-foreground text-xs sm:text-sm">Audio File</p>
                </div>
              </div>
              <audio :src="file?.url" controls class="w-full" preload="metadata">
                Browser Anda tidak mendukung tag audio.
              </audio>
            </div>
          </div>

          <!-- PDF Preview -->
          <div v-else-if="fileType === 'pdf'" class="h-full w-full">
            <iframe :src="file?.url" class="h-full w-full rounded border-0" title="PDF Preview"></iframe>
          </div>

          <!-- Unsupported/Error State -->
          <div v-else class="flex flex-col items-center justify-center p-4 text-center sm:p-8">
            <div class="bg-muted mb-4 rounded-lg p-4 sm:p-6">
              <FileIcon class="text-muted-foreground mx-auto h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <h3 class="mb-2 text-sm font-medium sm:text-base">
              {{ imageError ? "Gagal memuat gambar" : "Preview tidak tersedia" }}
            </h3>
            <p class="text-muted-foreground mb-4 text-xs sm:text-sm">
              {{
                imageError
                  ? "File gambar tidak dapat ditampilkan"
                  : `File ${fileExtension} tidak dapat di-preview langsung`
              }}
            </p>
            <div class="flex flex-col gap-2 sm:flex-row">
              <Button v-if="showDownload" variant="outline" size="sm" @click="handleDownload" class="w-full sm:w-auto">
                <Download class="mr-2 h-4 w-4" />
                <span class="hidden sm:inline">Download File</span>
                <span class="sm:hidden">Download</span>
              </Button>
              <Button
                v-if="showExternalLink"
                variant="outline"
                size="sm"
                @click="handleExternalLink"
                class="w-full sm:w-auto"
              >
                <ExternalLink class="mr-2 h-4 w-4" />
                <span class="hidden sm:inline">Buka di Tab Baru</span>
                <span class="sm:hidden">Buka</span>
              </Button>
            </div>
          </div>
        </div>

        <!-- File Info -->
        <div v-if="showFileInfo && file" class="bg-background border-t p-3 sm:p-4">
          <div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <div class="space-y-1">
              <dt class="text-muted-foreground text-xs font-medium sm:text-sm">Nama File</dt>
              <dd class="truncate text-xs sm:text-sm" :title="fileName">{{ fileName }}</dd>
            </div>
            <div v-if="file.size" class="space-y-1">
              <dt class="text-muted-foreground text-xs font-medium sm:text-sm">Ukuran</dt>
              <dd class="text-xs sm:text-sm">{{ fileSize(file.size) }}</dd>
            </div>
            <div v-if="fileExtension" class="space-y-1">
              <dt class="text-muted-foreground text-xs font-medium sm:text-sm">Tipe</dt>
              <dd class="text-xs sm:text-sm">{{ fileExtension }}</dd>
            </div>
            <div v-if="file.lastModified" class="space-y-1">
              <dt class="text-muted-foreground text-xs font-medium sm:text-sm">Dimodifikasi</dt>
              <dd class="text-xs sm:text-sm">{{ date(file.lastModified) }}</dd>
            </div>
          </div>
          <div v-if="file.description" class="mt-3 space-y-1 sm:mt-4">
            <dt class="text-muted-foreground text-xs font-medium sm:text-sm">Deskripsi</dt>
            <dd class="text-xs sm:text-sm">{{ file.description }}</dd>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
