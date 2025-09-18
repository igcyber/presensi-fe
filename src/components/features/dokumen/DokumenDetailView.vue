<script setup lang="ts">
import { ArrowLeft, Calendar, Download, FileText, Maximize2, User } from "lucide-vue-next";
import { computed } from "vue";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";
import type { Dokumen } from "@/lib/api/types/dokumen.types";

// Interface definitions
interface Props {
  dokumen: Dokumen;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", dokumen: Dokumen): void;
  (e: "delete", dokumen: Dokumen): void;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

// Emits
const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();
const filePreview = useFilePreview();

// Computed properties
const creatorInitials = computed(() => {
  const name = props.dokumen.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.dokumen);
};

const handleDelete = () => {
  emit("delete", props.dokumen);
};

const handlePreviewFullscreen = () => {
  filePreview.previewPDF(props.dokumen.fileUrl, props.dokumen.nama, {
    title: `Preview: ${props.dokumen.nama}`,
    showFileInfo: true,
  });
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
          {{ dokumen.nama }}
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
              <span class="truncate">{{ dokumen.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(dokumen.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :dokumen="dokumen" :on-edit="handleEdit" :on-delete="handleDelete">
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
        <CardTitle class="text-xl">Deskripsi Dokumen</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed">{{ dokumen.isi }}</div>
      </CardContent>
    </Card>

    <!-- PDF Preview/Download Card -->
    <Card v-if="dokumen.file">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          File Dokumen
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- PDF Info -->
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                <FileText class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{{ dokumen.file.split("/").pop() }}</p>
                <p class="text-muted-foreground truncate text-sm">{{ dokumen.file }}</p>
              </div>
            </div>
            <div class="flex flex-row gap-2">
              <Button
                @click="filePreview.handleDownload({ url: dokumen.fileUrl, name: dokumen.nama })"
                size="sm"
                class="gap-2 sm:w-auto"
              >
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

        <!-- PDF Embed (if fileUrl available) -->
        <div v-if="dokumen.fileUrl" class="relative overflow-hidden rounded-lg border">
          <iframe
            :src="dokumen.fileUrl"
            class="h-64 w-full border-0 sm:h-96"
            title="Dokumen PDF Preview"
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>

    <!-- No File Fallback -->
    <Card v-else>
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <FileText class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada file</p>
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
                {{ dokumen.createdByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(dokumen.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="dokumen.updatedAt && dokumen.updatedAt !== dokumen.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ dokumen.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(dokumen.updatedAt) }}
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
