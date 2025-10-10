<script setup lang="ts">
import { ArrowLeft, Calendar, Download, FileText, Maximize2, User } from "lucide-vue-next";
import { computed } from "vue";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";
import type { Statik } from "@/lib/api/types/statik.types";

interface Props {
  statik: Statik;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", statik: Statik): void;
  (e: "delete", statik: Statik): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date, slugToTitle } = useFormatters();
const filePreview = useFilePreview();

// Computed properties
const creatorInitials = computed(() => {
  const name = props.statik.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const sourceConfig = computed(() => {
  const configs = {
    file: { label: "File", icon: FileText, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    link: {
      label: "Link",
      icon: Download,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    text: {
      label: "Text",
      icon: FileText,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
  };
  return configs[props.statik.source] || configs.text;
});

const isFileSource = computed(() => {
  return props.statik.source === "file";
});

const isLinkSource = computed(() => {
  return props.statik.source === "link";
});

const isTextSource = computed(() => {
  return props.statik.source === "text";
});

// Determine if the file is video based on fileUrl extension
const isVideoFile = computed(() => {
  if (!props.statik.fileUrl) return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];
  return videoExtensions.some((ext) => props.statik.fileUrl?.toLowerCase().endsWith(ext));
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.statik);
};

const handleDelete = () => {
  emit("delete", props.statik);
};

const handleDownload = () => {
  if (props.statik.fileUrl) {
    window.open(props.statik.fileUrl, "_blank");
  }
};

const handlePreviewFullscreen = () => {
  if (props.statik.fileUrl) {
    const fileType = isVideoFile.value ? "video" : "image";
    filePreview.previewFile(
      {
        url: props.statik.fileUrl,
        name: props.statik.nama,
        type: fileType,
      },
      {
        title: `Preview: ${props.statik.nama}`,
        showFileInfo: true,
      },
    );
  }
};

const handleOpenLink = () => {
  if (props.statik.fileUrl || props.statik.attachment) {
    window.open(props.statik.fileUrl || props.statik.attachment || "", "_blank");
  }
};
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6 p-4">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div>

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title -->
        <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
          {{ statik.nama }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ statik.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Source -->
          <div class="flex items-center gap-2">
            <div :class="['rounded-lg p-1', sourceConfig.color]">
              <component :is="sourceConfig.icon" class="h-4 w-4" />
            </div>
            <Badge variant="secondary" class="truncate">{{ sourceConfig.label }}</Badge>
          </div>

          <!-- Kategori -->
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="truncate">{{ slugToTitle(statik.kategori) }}</Badge>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(statik.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :statik="statik" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <component :is="sourceConfig.icon" class="h-5 w-5" />
          {{ sourceConfig.label }} - {{ slugToTitle(statik.kategori) }}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Text Content (source: text) -->
        <div v-if="isTextSource" class="bg-muted/50 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div :class="['rounded-lg p-2', sourceConfig.color]">
              <component :is="sourceConfig.icon" class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <dt class="text-muted-foreground text-sm font-medium">Isi</dt>
              <dd class="mt-1 text-sm leading-relaxed break-words">{{ statik.isi }}</dd>
            </div>
          </div>
        </div>

        <!-- Link Content (source: link) -->
        <div v-else-if="isLinkSource" class="space-y-4">
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div :class="['rounded-lg p-2', sourceConfig.color]">
                <Download class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1 space-y-2">
                <div>
                  <dt class="text-muted-foreground text-sm font-medium">Deskripsi</dt>
                  <dd class="mt-1 text-sm leading-relaxed break-words">{{ statik.isi || "-" }}</dd>
                </div>
                <div>
                  <dt class="text-muted-foreground text-sm font-medium">URL</dt>
                  <dd class="mt-1 text-sm leading-relaxed break-all">
                    <a
                      :href="statik.fileUrl || statik.attachment || '#'"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      {{ statik.fileUrl || statik.attachment }}
                    </a>
                  </dd>
                </div>
                <Button v-if="statik.fileUrl || statik.attachment" @click="handleOpenLink" size="sm" class="mt-2 gap-2">
                  <Download class="h-4 w-4" />
                  Buka Link
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- File Content (source: file) -->
        <div v-else-if="isFileSource && statik.fileUrl" class="space-y-4">
          <!-- File Info -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3">
                <div :class="['rounded-lg p-2', sourceConfig.color]">
                  <component :is="sourceConfig.icon" class="h-6 w-6" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-wrap">{{ statik.nama }}</p>
                  <p class="text-muted-foreground text-sm text-wrap">{{ statik.isi }}</p>
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <Button @click="handleDownload" size="sm" class="gap-2 sm:w-auto">
                  <Download class="h-4 w-4" />
                  <span class="hidden sm:inline">Download</span>
                  <span class="sm:hidden">Download File</span>
                </Button>
                <Button variant="outline" size="sm" @click="handlePreviewFullscreen" class="gap-2 sm:w-auto">
                  <Maximize2 class="h-4 w-4" />
                  <span class="hidden sm:inline">Fullscreen</span>
                  <span class="sm:hidden">Preview</span>
                </Button>
              </div>
            </div>
          </div>

          <!-- File Preview -->
          <div v-if="isVideoFile" class="relative overflow-hidden rounded-lg border">
            <video :src="statik.fileUrl" class="h-64 w-full object-cover sm:h-96" controls>
              Browser Anda tidak mendukung video.
            </video>
          </div>
          <div v-else class="relative overflow-hidden rounded-lg border">
            <img
              :src="statik.fileUrl"
              :alt="statik.nama"
              class="h-64 w-full object-cover transition-transform hover:scale-105 sm:h-96"
            />
          </div>
        </div>

        <!-- No File Fallback -->
        <div v-else-if="isFileSource && !statik.fileUrl" class="p-8 text-center">
          <div class="text-muted-foreground">
            <component :is="sourceConfig.icon" class="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p class="text-sm">Tidak ada file</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Footer Information -->
    <Card class="bg-muted/50">
      <CardContent>
        <div class="grid gap-4 text-sm sm:grid-cols-2">
          <!-- Created Info -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Dibuat oleh:</span>
                {{ statik.createdByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(statik.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="statik.updatedAt && statik.updatedAt !== statik.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ statik.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(statik.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- File Preview Dialog -->
    <FilePreviewDialog
      v-model:open="filePreview.isOpen.value"
      :file="filePreview.currentFile.value"
      :title="filePreview.options.value.title"
      :show-download="filePreview.options.value.showDownload"
      :show-external-link="filePreview.options.value.showExternalLink"
      :show-file-info="filePreview.options.value.showFileInfo"
      :max-width="filePreview.options.value.maxWidth"
      :max-height="filePreview.options.value.maxHeight"
      @download="filePreview.handleDownload"
      @external-link="filePreview.handleExternalLink"
    />
  </div>
</template>
