<script setup lang="ts">
import { AlertCircle, FileText, X } from "lucide-vue-next";
import { defineExpose, onBeforeUnmount, ref, watch } from "vue";

const pdfContainerRef = ref<HTMLDivElement | null>(null);
const isOpen = ref<boolean>(false);
const currentUrl = ref<string>("");
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);

// Utility functions
const clearIframe = () => {
  if (pdfContainerRef.value) {
    pdfContainerRef.value.innerHTML = "";
  }
};

const setPdfContainerRef = (el: HTMLDivElement | null) => {
  pdfContainerRef.value = el;
};

const mountIframe = () => {
  if (!pdfContainerRef.value || !currentUrl.value) return;

  // Clear previous content
  clearIframe();
  isLoading.value = true;
  hasError.value = false;

  const iframe = document.createElement("iframe");
  iframe.src = currentUrl.value;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.className = "w-full h-full";

  // Handle load events
  iframe.onload = () => {
    isLoading.value = false;
  };

  iframe.onerror = () => {
    isLoading.value = false;
    hasError.value = true;
  };

  pdfContainerRef.value.appendChild(iframe);
};

// Modal API
const open = (url?: string) => {
  if (url) {
    currentUrl.value = url;
  }
  isOpen.value = true;

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
};

const close = () => {
  isOpen.value = false;
  clearIframe();
  isLoading.value = false;
  hasError.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
};

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    close();
  }
};

// Watch for modal state changes
watch([isOpen, pdfContainerRef], ([newIsOpen, newPdfContainerRef]) => {
  if (newIsOpen && newPdfContainerRef) {
    // Mount iframe when modal opens
    mountIframe();
    // Add keyboard listener
    document.addEventListener("keydown", handleKeydown);
  } else {
    // Remove keyboard listener when modal closes
    document.removeEventListener("keydown", handleKeydown);
  }
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

defineExpose({ open, close });
</script>

<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 lg:p-8"
        @click="close"
      >
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="mx-4 max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
              <div class="flex items-center">
                <FileText class="mr-2 h-5 w-5 text-yellow-600" />
                <h3 class="text-lg font-semibold text-gray-900">Preview Dokumen</h3>
              </div>
              <button
                @click="close"
                class="h-10 w-10 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Tutup modal"
              >
                <X class="h-6 w-6" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4">
              <!-- Loading State -->
              <div v-if="isLoading" class="flex items-center justify-center py-12">
                <div class="text-center">
                  <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-600"></div>
                  <p class="text-gray-600">Memuat dokumen...</p>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="hasError" class="flex items-center justify-center py-12">
                <div class="text-center">
                  <AlertCircle class="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <h4 class="mb-2 text-lg font-semibold text-gray-900">Gagal Memuat Dokumen</h4>
                  <p class="text-gray-600">Dokumen tidak dapat ditampilkan. Silakan coba download langsung.</p>
                </div>
              </div>

              <!-- PDF Container -->
              <div v-else class="relative aspect-[4/3] w-full overflow-hidden rounded bg-gray-100">
                <div :ref="(el) => setPdfContainerRef(el as HTMLDivElement)" class="absolute inset-0"></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
