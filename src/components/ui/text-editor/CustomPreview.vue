<script setup lang="ts">
import { Printer, X } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  content: string;
  isOpen: boolean;
}

interface Emits {
  (e: "update:isOpen", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed untuk mengontrol dialog
const dialogOpen = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emit("update:isOpen", value),
});

// Ref untuk container konten
const previewContainer = ref<HTMLDivElement>();

// Fungsi untuk menutup dialog
const closePreview = () => {
  dialogOpen.value = false;
};

// Fungsi untuk mencetak konten
const printContent = () => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Preview</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
            }
            p {
              margin-bottom: 1em;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            blockquote {
              border-left: 4px solid #ddd;
              margin: 1em 0;
              padding-left: 1em;
              color: #666;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: monospace;
            }
            pre {
              background-color: #f4f4f4;
              padding: 1em;
              border-radius: 5px;
              overflow-x: auto;
            }
            ul, ol {
              margin: 1em 0;
              padding-left: 2em;
            }
            @media print {
              body {
                max-width: none;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${props.content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle>Pratinjau Konten</DialogTitle>
        <DialogDescription>
          Pratinjau konten yang telah Anda tulis di editor. Anda dapat mencetak atau menutup pratinjau ini.
        </DialogDescription>
      </DialogHeader>

      <!-- Toolbar -->
      <div class="mb-4 flex items-center justify-between border-b pb-3">
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="printContent">
            <Printer class="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
        <Button variant="outline" size="sm" @click="closePreview">
          <X class="mr-2 h-4 w-4" />
          Tutup
        </Button>
      </div>

      <!-- Preview Content -->
      <div ref="previewContainer" class="flex-1 overflow-auto rounded-md border bg-white p-6 dark:bg-gray-900">
        <div class="prose prose-sm dark:prose-invert max-w-none" v-html="content"></div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style>
/* Styling khusus untuk konten pratinjau */
.prose {
  color: inherit;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: inherit;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 1em;
  line-height: 1.7;
}

.prose img {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.prose table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5em 0;
}

.prose table,
.prose th,
.prose td {
  border: 1px solid rgb(229 231 235);
}

.prose th,
.prose td {
  padding: 12px;
  text-align: left;
}

.prose th {
  background-color: rgb(249 250 251);
  font-weight: 600;
}

.prose blockquote {
  border-left: 4px solid rgb(59 130 246);
  margin: 1.5em 0;
  padding-left: 1.5em;
  font-style: italic;
  color: rgb(107 114 128);
}

.prose code {
  background-color: rgb(249 250 251);
  color: rgb(17 24 39);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.875em;
}

.prose pre {
  background-color: rgb(249 250 251);
  padding: 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}

.prose ul,
.prose ol {
  margin: 1.5em 0;
  padding-left: 2em;
}

.prose li {
  margin: 0.5em 0;
}

/* Dark mode specific styles */
.dark .prose {
  color: rgb(243 244 246);
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
  color: rgb(249 250 251);
}

.dark .prose strong {
  color: rgb(249 250 251);
}

.dark .prose a {
  color: rgb(59 130 246);
}

.dark .prose code {
  color: rgb(243 244 246);
}

.dark .prose table,
.dark .prose th,
.dark .prose td {
  border: 1px solid rgb(75 85 99);
}

.dark .prose th {
  background-color: rgb(55 65 81);
  color: rgb(243 244 246);
}

.dark .prose blockquote {
  border-left: 4px solid rgb(59 130 246);
  color: rgb(156 163 175);
}

.dark .prose code {
  background-color: rgb(55 65 81);
  color: rgb(243 244 246);
}

.dark .prose pre {
  background-color: rgb(55 65 81);
}
</style>
