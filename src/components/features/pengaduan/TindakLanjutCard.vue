<script setup lang="ts">
import { Calendar, Download, Edit, FileText, Trash2 } from "lucide-vue-next";
import { computed } from "vue";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";
import type { TindakLanjut } from "@/lib/api/types/tindakLanjut.types";

interface Props {
  tindakLanjut: TindakLanjut;
  index: number;
  loading?: boolean;
}

interface Emits {
  (e: "edit", tindakLanjut: TindakLanjut): void;
  (e: "delete", tindakLanjut: TindakLanjut): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();
const filePreview = useFilePreview();

// Computed properties
const hasDocument = computed(() => {
  return props.tindakLanjut.dokumenDukungUrl;
});

const documentUrl = computed(() => {
  return props.tindakLanjut.dokumenDukungUrl;
});

const documentName = computed(() => {
  if (!documentUrl.value) return "";
  return documentUrl.value.split("/").pop() || "Dokumen";
});

// Methods
const handleEdit = () => {
  emit("edit", props.tindakLanjut);
};

const handleDelete = () => {
  emit("delete", props.tindakLanjut);
};

const handlePreviewDocument = () => {
  if (documentUrl.value) {
    filePreview.previewPDF(documentUrl.value, documentName.value, {
      title: `Preview: ${documentName.value}`,
      showFileInfo: true,
    });
  }
};

const handleDownloadDocument = () => {
  if (documentUrl.value) {
    filePreview.handleDownload({ url: documentUrl.value, name: documentName.value });
  }
};
</script>

<template>
  <Card class="transition-all duration-200 hover:shadow-md">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <CardTitle class="text-lg">Tindak Lanjut #{{ index }}</CardTitle>
          <div class="text-muted-foreground flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1">
              <Calendar class="h-4 w-4" />
              <span>Mulai: {{ date(tindakLanjut.tanggalMulai) }}</span>
            </div>
            <div v-if="tindakLanjut.tanggalTindakLanjut" class="flex items-center gap-1">
              <Calendar class="h-4 w-4" />
              <span>Selesai: {{ date(tindakLanjut.tanggalTindakLanjut) }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="handleEdit" :disabled="loading">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" @click="handleDelete" :disabled="loading">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>

    <Separator />

    <CardContent class="space-y-4">
      <!-- Deskripsi -->
      <div>
        <h4 class="text-muted-foreground mb-2 text-sm font-medium">Deskripsi</h4>
        <p class="text-sm whitespace-pre-wrap">{{ tindakLanjut.deskripsi }}</p>
      </div>

      <!-- Dokumen Pendukung -->
      <div v-if="hasDocument">
        <h4 class="text-muted-foreground mb-2 text-sm font-medium">Dokumen Pendukung</h4>
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                <FileText class="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium">{{ documentName }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ documentUrl }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="handlePreviewDocument">
                <FileText class="mr-1 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm" @click="handleDownloadDocument">
                <Download class="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Tanggal -->
      <div class="text-muted-foreground border-t pt-2 text-xs">
        <p>Dibuat: {{ date(tindakLanjut.createdAt) }}</p>
        <p v-if="tindakLanjut.updatedAt !== tindakLanjut.createdAt">Diupdate: {{ date(tindakLanjut.updatedAt) }}</p>
      </div>
    </CardContent>

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
  </Card>
</template>
