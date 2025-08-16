<template>
  <div ref="modalRef" id="videoModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="videoModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="videoModalLabel">Video</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Wrapper 16:9, aman di semua browser modern -->
          <div class="ratio-16x9">
            <div ref="videoContainerRef" class="ratio-inner"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineExpose, onBeforeUnmount, onMounted, ref } from "vue";

const modalRef = ref<HTMLDivElement | null>(null);
const videoContainerRef = ref<HTMLDivElement | null>(null);

const currentUrl = ref<string>("");

// deteksi ketersediaan jQuery (Bootstrap 4)
const $jq = () => (window as any).$ || (window as any).jQuery;

// utils
const clearIframe = () => {
  if (videoContainerRef.value) {
    videoContainerRef.value.innerHTML = "";
  }
};
const mountIframe = () => {
  if (!videoContainerRef.value || !currentUrl.value) return;
  // ganti konten lama
  clearIframe();

  const iframe = document.createElement("iframe");
  iframe.src = currentUrl.value;
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  );
  iframe.setAttribute("allowfullscreen", "true");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.display = "block";
  videoContainerRef.value.appendChild(iframe);
};

// API
const open = (url?: string) => {
  if (url) currentUrl.value = url;
  mountIframe();
  const $ = $jq();
  if ($ && modalRef.value) {
    $(modalRef.value).modal("show");
  }
};

onMounted(() => {
  const $ = $jq();
  if ($ && modalRef.value) {
    const $m = $(modalRef.value);
    $m.one("hidden.bs.modal.VideoModal", () => {
      clearIframe();
    });
  }
});

const close = () => {
  const $ = $jq();
  if ($ && modalRef.value) {
    $(modalRef.value).modal("hide");
    clearIframe();
  }
};

onBeforeUnmount(() => {
  const $ = $jq();
  if ($ && modalRef.value) {
    $(modalRef.value).off(".VideoModal");
  }
});

defineExpose({ open, close });
</script>

<style scoped>
/* Fallback ratio 16:9 */
.ratio-16x9 {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}
.ratio-16x9 .ratio-inner {
  position: absolute;
  inset: 0;
}
</style>
