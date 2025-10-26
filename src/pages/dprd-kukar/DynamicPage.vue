<script setup lang="ts">
import { AlertCircle, Download, File, FileText, Maximize2, RefreshCw, Search } from "lucide-vue-next";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

import FilePreviewDialog from "@/components/dialogs/FilePreviewDialog.vue";
import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFetch } from "@/composables/useFetch";
import { useFilePreview } from "@/composables/useFilePreview";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core";
import { getMenuBySlug } from "@/lib/api/services/menu";
import type { MenuBySlugResponse } from "@/lib/api/types/menu.types";

// Composables
const route = useRoute();
const { slugToTitle } = useFormatters();
const filePreview = useFilePreview();

// Computed properties
const slug = computed(() => route.params.slug as string);

// Fetch menu data
const { data, isLoading, error, isError, fetchData } = useFetch<ApiResponse<MenuBySlugResponse>, MenuBySlugResponse>(
  () => getMenuBySlug(slug.value),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const menuData = computed(() => data.value);
const isFileType = computed(() => menuData.value?.page?.tipe === "file");
const fileUrl = computed(() => menuData.value?.page?.fileUrl || "");
const fileName = computed(() => menuData.value?.page?.file || "");

// Methods
const handlePreviewFullscreen = () => {
  if (fileUrl.value) {
    filePreview.previewPDF(fileUrl.value, menuData.value?.page?.nama || "Dokumen", {
      title: `Preview: ${menuData.value?.page?.nama || "Dokumen"}`,
      showFileInfo: true,
    });
  }
};

const handleFileDownload = () => {
  if (fileUrl.value) {
    filePreview.handleDownload({
      url: fileUrl.value,
      name: menuData.value?.page?.nama || fileName.value.split("/").pop() || "dokumen.pdf",
    });
  }
};

// Watchers
watch(
  slug,
  async () => {
    await fetchData();
  },
  { immediate: true },
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
            <p class="text-gray-600">Memuat konten halaman...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="isError" class="mx-auto max-w-2xl">
          <div class="rounded border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle class="text-destructive mx-auto mb-4 h-10 w-10" />
            <h4 class="mb-4 text-xl font-semibold text-red-800">Terjadi Kesalahan</h4>
            <p class="mb-6 text-red-700">{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
            <button
              class="inline-flex items-center rounded bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              @click="fetchData"
            >
              <RefreshCw class="mr-2 h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="menuData">
          <!-- File Type Content -->
          <div v-if="menuData.page && isFileType" class="space-y-6">
            <!-- Header Card -->
            <Card class="shadow-lg">
              <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100 py-6">
                <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                    <FileText class="h-5 w-5 text-white" />
                  </div>
                  {{ menuData.nama }}
                </CardTitle>
              </CardHeader>
              <CardContent class="p-6">
                <!-- File Info -->
                <div class="bg-muted/50 mb-6 rounded-lg p-4">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                      <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                        <FileText class="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-wrap">{{ fileName.split("/").pop() }}</p>
                        <p class="text-muted-foreground text-sm text-wrap">{{ fileName }}</p>
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

                <!-- PDF Embed -->
                <div v-if="fileUrl" class="relative overflow-hidden rounded-lg border">
                  <iframe
                    :src="fileUrl"
                    class="h-64 w-full border-0 sm:h-96 lg:h-[500px]"
                    title="Dokumen PDF Preview"
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>

            <!-- Content Card (if has content) -->
            <Card v-if="menuData.page.content" class="shadow-lg">
              <CardHeader>
                <CardTitle class="text-xl">Deskripsi Dokumen</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="p-6">
                <div
                  class="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-yellow-600 hover:prose-a:text-yellow-700 max-w-none"
                  v-html="menuData.page.content"
                ></div>
              </CardContent>
            </Card>
          </div>

          <!-- Text Content Type -->
          <Card v-else-if="menuData.page && !isFileType" class="shadow-lg">
            <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100 py-6">
              <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                  <FileText class="h-5 w-5 text-white" />
                </div>
                {{ menuData.nama }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-8">
              <div
                class="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-yellow-600 hover:prose-a:text-yellow-700 max-w-none"
                v-html="menuData.page.content"
              ></div>
            </CardContent>
          </Card>

          <!-- No Page Content -->
          <Card v-else class="shadow-lg">
            <CardHeader class="bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardTitle class="flex items-center gap-3 text-2xl text-gray-800">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600">
                  <File class="h-5 w-5 text-white" />
                </div>
                {{ menuData.nama }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-8">
              <div class="py-12 text-center">
                <div class="mb-4 flex justify-center">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <File class="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 class="mb-2 text-lg font-semibold text-gray-700">Konten Belum Tersedia</h3>
                <p class="mx-auto max-w-md text-gray-600">
                  Konten untuk halaman "{{ menuData.nama }}" sedang dalam proses penyiapan. Silakan kembali lagi nanti
                  atau hubungi administrator untuk informasi lebih lanjut.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Not Found -->
        <div v-else class="mx-auto max-w-2xl">
          <div class="rounded border border-yellow-200 bg-yellow-50 p-8 text-center">
            <Search class="mx-auto mb-4 h-10 w-10 text-yellow-600" />
            <h4 class="mb-4 text-xl font-semibold text-yellow-600">Halaman Tidak Ditemukan</h4>
            <p class="text-yellow-700">Maaf, halaman "{{ slugToTitle(slug) }}" tidak ditemukan atau tidak tersedia.</p>
          </div>
        </div>
      </div>
    </main>

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
