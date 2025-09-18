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
import type { Majalah } from "@/lib/api/types/majalah.types";
import { MONTH_OPTIONS } from "@/lib/api/types/majalah.types";

interface Props {
  majalah: Majalah;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", majalah: Majalah): void;
  (e: "delete", majalah: Majalah): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();
const filePreview = useFilePreview();

// Computed properties
const monthName = computed(() => {
  const month = MONTH_OPTIONS.find((m) => m.value === props.majalah.bulan);
  return month?.label || "Unknown";
});

const creatorInitials = computed(() => {
  const name = props.majalah.creator?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const majalahTitle = computed(() => {
  return `Majalah Kukar Edisi ${String(props.majalah.bulan).padStart(2, "0")} - ${props.majalah.tahun}`;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.majalah);
};

const handleDelete = () => {
  emit("delete", props.majalah);
};

const handleDownload = () => {
  if (props.majalah.linkUrl) {
    window.open(props.majalah.linkUrl, "_blank");
  }
};

const handlePreviewFullscreen = () => {
  if (props.majalah.linkUrl) {
    filePreview.previewPDF(props.majalah.linkUrl, majalahTitle.value, {
      title: `Preview: ${majalahTitle.value}`,
      showFileInfo: true,
    });
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
          {{ majalahTitle }}
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
              <span class="truncate">{{ majalah.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Month & Year -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ monthName }} {{ majalah.tahun }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(majalah.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :majalah="majalah" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- PDF Preview/Download Card -->
    <Card v-if="majalah.link">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          File Majalah
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
                <p class="truncate font-medium">{{ majalahTitle }}.pdf</p>
                <p class="text-muted-foreground truncate text-sm">{{ majalah.link }}</p>
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

        <!-- PDF Embed (if linkUrl available) -->
        <div v-if="majalah.linkUrl" class="relative overflow-hidden rounded-lg border">
          <iframe
            :src="majalah.linkUrl"
            class="h-64 w-full border-0 sm:h-96"
            title="Majalah PDF Preview"
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
                {{ majalah.creator?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(majalah.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="majalah.updatedAt && majalah.updatedAt !== majalah.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ majalah.updater?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(majalah.updatedAt) }}
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
