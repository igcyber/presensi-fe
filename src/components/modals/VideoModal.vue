<script setup lang="ts">
import { defineExpose, onBeforeUnmount, ref, watch } from "vue";

const videoContainerRef = ref<HTMLDivElement | null>(null);
const isOpen = ref<boolean>(false);
const currentUrl = ref<string>("");

// Utility functions
const clearIframe = () => {
  if (videoContainerRef.value) {
    videoContainerRef.value.innerHTML = "";
  }
};

const setVideoContainerRef = (el: HTMLDivElement | null) => {
  videoContainerRef.value = el;
};

const mountIframe = () => {
  if (!videoContainerRef.value || !currentUrl.value) return;

  // Clear previous content
  clearIframe();

  const iframe = document.createElement("iframe");
  iframe.src = currentUrl.value;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  );
  iframe.setAttribute("allowfullscreen", "true");
  iframe.className = "w-full h-full";

  videoContainerRef.value.appendChild(iframe);
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
watch([isOpen, videoContainerRef], ([newIsOpen, newVideoContainerRef]) => {
  if (newIsOpen && newVideoContainerRef) {
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
            class="mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded bg-white shadow-xl"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 class="text-lg font-semibold text-gray-900">Video</h3>
              <button
                @click="close"
                class="h-10 w-10 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Tutup modal"
              >
                <i class="bx bx-x text-2xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4">
              <!-- Video Container dengan aspek rasio 16:9 -->
              <div class="relative aspect-video w-full overflow-hidden rounded bg-gray-100">
                <div :ref="(el) => setVideoContainerRef(el as HTMLDivElement)" class="absolute inset-0"></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
