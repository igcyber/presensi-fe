<script setup lang="ts">
import { ArrowLeft, Copy, Download, FileText, Maximize2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFilePreview } from "@/composables/useFilePreview";
import type { BukuTamuDetailResponse } from "@/lib/api/types/bukuTamu.types";

// Interface definitions
interface Props {
  buku: BukuTamuDetailResponse;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "delete", buku: BukuTamuDetailResponse): void;
  (e: "toggleRegistered", buku: BukuTamuDetailResponse): void;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

// Emits
const emit = defineEmits<Emits>();

// Composables
const filePreview = useFilePreview();

// Event handlers
const handleBack = () => emit("back");

const handleDelete = () => emit("delete", props.buku);

const handleToggleRegistered = () => {
  emit("toggleRegistered", props.buku);
};

const handlePreviewFullscreen = () => {
  if (props.buku.fileUrl) {
    filePreview.previewPDF(props.buku.fileUrl, props.buku.nama, {
      title: `Preview: ${props.buku.nama}`,
      showFileInfo: true,
    });
  }
};

const handleFileDownload = () => {
  if (props.buku.fileUrl) {
    filePreview.handleDownload({ url: props.buku.fileUrl, name: props.buku.nama });
  }
};

const handleCopyLink = () => {
  if (props.buku.link) {
    navigator.clipboard.writeText(window.location.origin + props.buku.link);
    toast.success("Link berhasil disalin", {
      description: "Link berhasil disalin ke clipboard",
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
        <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
          {{ buku.judul }}
        </CardTitle>

        <!-- Actions Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :buku="buku" :on-delete="handleDelete" :on-toggle-registered="handleToggleRegistered">
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Detail Card -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Informasi Buku Tamu</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="grid gap-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground text-sm font-medium">Nama</div>
              <div>{{ buku.nama ?? "-" }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-sm font-medium">No. HP</div>
              <div>{{ buku.nohp ?? "-" }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-sm font-medium">Asal</div>
              <div>{{ buku.asal ?? "-" }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-sm font-medium">Tujuan</div>
              <div>{{ buku.tujuan ?? "-" }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-sm font-medium">Jumlah Tamu</div>
              <div>{{ buku.jumlahTamu ?? 0 }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-sm font-medium">Perihal</div>
              <div>{{ buku.perihal ?? "-" }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div class="text-muted-foreground text-sm font-medium">Registered</div>
              <div>{{ Number(buku.isRegistered) === 1 ? "Ya" : "Tidak" }}</div>
            </div>
          </div>

          <div>
            <div class="text-muted-foreground text-sm font-medium">Link Publik</div>
            <div>
              <template v-if="buku.link">
                <div class="flex items-center gap-2">
                  <code class="bg-muted flex-1 rounded px-2 py-1 text-xs">{{ buku.link }}</code>
                  <Button variant="outline" size="sm" @click="handleCopyLink" class="gap-1">
                    <Copy class="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </template>
              <template v-else>-</template>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- PDF Preview/Download Card -->
    <Card v-if="buku.fileUrl">
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
                <p class="font-medium text-wrap">{{ buku.fileUrl.split("/").pop() }}</p>
                <p class="text-muted-foreground text-sm text-wrap">{{ buku.fileUrl }}</p>
              </div>
            </div>
            <div class="flex flex-row gap-2">
              <Button @click="handleFileDownload" size="sm" class="gap-2 sm:w-auto">
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
        <div v-if="buku.fileUrl" class="relative overflow-hidden rounded-lg border">
          <iframe :src="buku.fileUrl" class="h-64 w-full border-0 sm:h-96" title="Dokumen PDF Preview" loading="lazy" />
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
