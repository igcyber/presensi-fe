<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const cardRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
const isHovered = ref(false);
const cardWidth = ref(0);
const cardHeight = ref(0);

const updateCardDimensions = () => {
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect();
    cardWidth.value = rect.width;
    cardHeight.value = rect.height;
    // Inisialisasi ke posisi tengah jika belum di-set
    if (mouseX.value === 0 && mouseY.value === 0) {
      mouseX.value = rect.width / 2;
      mouseY.value = rect.height / 2;
    }
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  // Smooth transition kembali ke tengah
  if (cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect();
    mouseX.value = rect.width / 2;
    mouseY.value = rect.height / 2;
  }
};

onMounted(() => {
  nextTick(() => {
    updateCardDimensions();
    // Update dimensions saat window resize
    window.addEventListener("resize", updateCardDimensions);
  });
});

onUnmounted(() => {
  // Cleanup event listener
  window.removeEventListener("resize", updateCardDimensions);
});

const shadowStyle = computed(() => {
  // Deteksi dark mode
  const isDark = document.documentElement.classList.contains('dark');

  // Warna shadow: hitam untuk light mode, putih untuk dark mode
  const shadowColor = isDark
    ? { r: 255, g: 255, b: 255 } // putih untuk dark mode
    : { r: 0, g: 0, b: 0 }; // hitam untuk light mode

  if (!cardRef.value || cardWidth.value <= 0 || cardHeight.value <= 0) {
    const defaultOpacity = isDark ? 0.15 : 0.1;
    return {
      boxShadow: `0 0 20px 5px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${defaultOpacity}), 0 0 10px -2px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${defaultOpacity * 1.2})`,
    };
  }

  const centerX = cardWidth.value / 2;
  const centerY = cardHeight.value / 2;

  // Pastikan tidak ada pembagian nol
  if (centerX === 0 || centerY === 0) {
    const defaultOpacity = isDark ? 0.15 : 0.1;
    return {
      boxShadow: `0 0 20px 5px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${defaultOpacity}), 0 0 10px -2px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${defaultOpacity * 1.2})`,
    };
  }

  // Hitung offset dari center (normalized -1 sampai 1)
  const offsetX = (mouseX.value - centerX) / centerX;
  const offsetY = (mouseY.value - centerY) / centerY;

  // Intensitas shadow berdasarkan hover state
  const intensity = isHovered.value ? 1 : 0.6;

  // Shadow offset berdasarkan posisi cursor (dalam px)
  const shadowX = offsetX * 24 * intensity;
  const shadowY = offsetY * 24 * intensity;

  // Ambient shadow - lebih besar dan lebih blur untuk efek ambient
  const ambientBlur = 50 * intensity;
  const ambientSpread = 12 * intensity;
  // Opacity untuk ambient shadow (lebih lembut) - lebih tinggi untuk dark mode
  const ambientOpacity = isHovered.value
    ? (isDark ? 0.2 : 0.15)
    : (isDark ? 0.12 : 0.08);

  // Directional shadow yang mengikuti cursor
  const directionalBlur = 25 * intensity;
  const directionalSpread = -8;
  // Opacity untuk directional shadow (lebih jelas) - lebih tinggi untuk dark mode
  const directionalOpacity = isHovered.value
    ? (isDark ? 0.3 : 0.2)
    : (isDark ? 0.18 : 0.12);

  // Multiple shadows: ambient shadow (global) + directional shadow (mengikuti cursor)
  const ambientShadow = `0 0 ${ambientBlur}px ${ambientSpread}px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${ambientOpacity})`;
  const directionalShadow = `${shadowX}px ${shadowY}px ${directionalBlur}px ${directionalSpread}px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${directionalOpacity})`;

  return {
    boxShadow: `${ambientShadow}, ${directionalShadow}`,
    transition: isHovered.value ? "box-shadow 0.15s ease-out" : "box-shadow 0.4s ease-out",
  };
});
</script>

<template>
  <div
    ref="cardRef"
    data-slot="card"
    :class="cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6', props.class)"
    :style="shadowStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <slot />
  </div>
</template>
