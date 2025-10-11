<script setup lang="ts">
import {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  Columns,
  EchoEditor,
  FindAndReplace,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImageUpload,
  Indent,
  Italic,
  LineHeight,
  Link,
  locale,
  MoreMark,
  OrderedList,
  Printer,
  SlashCommand,
  Strike,
  Table,
  TaskList,
  TextAlign,
  Underline,
  Video,
} from "echo-editor";
import { computed, onMounted, onUnmounted, ref } from "vue";

import "echo-editor/style.css";

import { ENV_CONFIG } from "@/lib/config/environment";
import { ImageDeleteListener } from "@/lib/utils/ImageDeleteListener";
import { useAuthStore } from "@/stores/authStore";

import CustomPreview from "./CustomPreview.vue";
import CustomPreviewExtension from "./CustomPreviewExtension";

const authStore = useAuthStore();

// State untuk pratinjau kustom
const showPreview = ref(false);

// Props / Emits
const props = defineProps<{
  modelValue: string;
  hideToolbar?: boolean;
  hideMenubar?: boolean;
  disabled?: boolean;
  uploadUrl?: string; // endpoint POST upload image
  placeholder?: string;
  localeCustom?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

// Computed
const content = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

// Helper Functions
async function uploadImageToServer(file: File, url: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
      },
    });

    if (!res.ok) throw new Error("Upload failed");
    const response = await res.json();

    // Handle response dari temporary API
    if (response.data && response.data.fileUrl) {
      return response.data.fileUrl;
    } else if (response.data && response.data.url) {
      return response.data.url;
    } else if (response.fileUrl) {
      return response.fileUrl;
    } else if (response.url) {
      return response.url;
    }

    throw new Error("Invalid response format");
  } catch (e) {
    console.error("Image upload error:", e);
    return URL.createObjectURL(file); // fallback: tampilkan blob lokal
  }
}

async function removeImageFromServer(imageUrl: string) {
  try {
    // Extract ID dari URL temporary
    // URL format: http://localhost:7001/temporary/filename.jpg
    // Kita perlu mencari ID berdasarkan filename atau menggunakan endpoint lain

    // Untuk sementara, kita akan menggunakan filename untuk mencari ID
    const filenameMatch = imageUrl.match(/temporary\/([^\/\?]+)/);
    const filename = filenameMatch?.[1];

    if (!filename) {
      console.warn("Cannot parse filename from URL:", imageUrl);
      return;
    }

    // Cari ID berdasarkan filename dengan GET request
    const searchUrl = `${ENV_CONFIG.apiBaseUrl}/api/temporary?search=${filename}`;

    try {
      const searchRes = await fetch(searchUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
        },
      });

      if (!searchRes.ok) {
        console.error("Failed to search temporary data");
        return;
      }

      const searchData = await searchRes.json();

      if (searchData.data && searchData.data.data && searchData.data.data.length > 0) {
        const tempData = searchData.data.data.find(
          (item: any) => item.fileName === filename || item.fileUrl === imageUrl,
        );

        if (tempData && tempData.id) {
          const deleteUrl = `${ENV_CONFIG.apiBaseUrl}/api/temporary/${tempData.id}`;

          const deleteRes = await fetch(deleteUrl, {
            method: "DELETE",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            },
          });

          if (deleteRes.ok) {
            console.log("Removed temporary data ID:", tempData.id);
          } else {
            console.error("Failed to remove temporary data ID:", tempData.id);
          }
        } else {
          console.warn("Temporary data not found for filename:", filename);
        }
      } else {
        console.warn("No temporary data found for filename:", filename);
      }
    } catch (searchErr) {
      console.error("Error searching temporary data:", searchErr);
    }
  } catch (err) {
    console.error("Remove image error:", err);
  }
}

// Event handler untuk update konten
function onEditorUpdate() {}

// Fungsi untuk membuka pratinjau kustom
function openCustomPreview() {
  showPreview.value = true;
}

// Echo-Editor Extensions Configuration - Memoized untuk performa
const extensions = computed(() => [
  BaseKit.configure({
    placeholder: {
      placeholder: props.placeholder ?? "Mulai menulis...",
      showOnlyCurrent: true,
    },
    characterCount: { limit: 50000 },
  }),
  History,
  Columns,
  FormatPainter,
  Clear,
  Heading.configure({ spacer: true }),
  FontSize,
  FontFamily,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph", "image"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({ spacer: true, taskItem: { nested: true } }),
  Link,
  Image,
  ImageUpload.configure({
    upload: (file: File) => {
      const endpoint = props.uploadUrl ?? `${ENV_CONFIG.apiBaseUrl}/api/temporary`;
      return uploadImageToServer(file, endpoint);
    },
  }),
  Video,
  Blockquote,
  SlashCommand,
  HorizontalRule,
  CodeBlock,
  Table,
  Code,
  FindAndReplace.configure({ spacer: true }),
  Printer,
  CustomPreviewExtension.configure({
    onPreview: openCustomPreview,
  }),
  Iframe,
  // Listener khusus hapus-gambar
  ImageDeleteListener,
]);

// Lifecycle Hooks
onMounted(() => {
  locale.setLang(props.localeCustom ?? "en");
  // Expose helper agar bisa dipanggil oleh plugin
  (window as any).__echoRemoveImageFromServer = removeImageFromServer;

  // Patch: cegah semua tombol di dalam echo-editor melakukan submit form
  const editorEl = document.querySelector(".echo-editor");
  if (editorEl) {
    editorEl.querySelectorAll("button").forEach((btn) => {
      btn.setAttribute("type", "button");
    });
  }

  // Patch: cegah semua tombol di dalam echo-editor melakukan submit form
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // Cari semua tombol di node yang baru
          const buttons = node.querySelectorAll("button");
          buttons.forEach((btn) => {
            if (!btn.getAttribute("type")) {
              btn.setAttribute("type", "button");
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

onUnmounted(() => {
  delete (window as any).__echoRemoveImageFromServer;
});

defineExpose({
  openCustomPreview,
});
</script>

<template>
  <div>
    <EchoEditor
      class="rounded-md border border-[#4ade80]/50 focus-within:border-[#4ade80] focus-within:ring-[3px] focus-within:ring-[#4ade80]/50"
      :class="{
        '!border-[#a24639] !ring-[#a24639]/20 dark:!ring-[#a24639]/40': error,
      }"
      v-model="content"
      :extensions="extensions"
      output="html"
      :hideToolbar="hideToolbar"
      :hideMenubar="hideMenubar"
      :disabled="disabled"
      :maxHeight="512"
      :minHeight="200"
      :locale="localeCustom"
      :dark="false"
      @update="onEditorUpdate"
    />

    <!-- Custom Preview Component -->
    <CustomPreview :content="content" v-model:isOpen="showPreview" />
  </div>
</template>

<style>
/* Tambahan padding di dalam editor */
.echo-editor .tiptap {
  padding-top: 55px !important;
  width: 650px !important;
}
</style>

<style scoped>
/* Fix outline di dalam editor */
.echo-editor.echo-editor-focus {
  outline: none !important;
}

/* Matikan submit default di toolbar echo-editor */
.echo-editor button {
  pointer-events: auto !important;
}

@media screen and (min-width: 341px) and (max-width: 418px) {
  .echo-editor {
    width: 79vw !important;
  }
}

@media screen and (min-width: 419px) and (max-width: 479px) {
  .echo-editor {
    width: 83vw !important;
  }
}

@media screen and (min-width: 480px) and (max-width: 600px) {
  .echo-editor {
    width: 84vw !important;
  }
}

@media screen and (min-width: 601px) and (max-width: 639px) {
  .echo-editor {
    width: 87vw !important;
  }
}
</style>
