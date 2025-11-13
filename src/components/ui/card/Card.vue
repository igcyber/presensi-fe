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
  // Warna furry purple untuk shadow (mengikuti warna card)
  // Menggunakan warna ungu yang lembut: rgb(168, 85, 247) - purple-500 atau variasi yang lebih lembut
  const purpleColor = {
    r: 168, // purple-500
    g: 85,
    b: 247,
  };

  // Variasi warna ungu yang lebih lembut untuk ambient shadow
  const purpleLight = {
    r: 192, // purple-400
    g: 132,
    b: 252,
  };

  if (!cardRef.value || cardWidth.value <= 0 || cardHeight.value <= 0) {
    return {
      boxShadow: `0 0 20px 5px rgba(${purpleLight.r}, ${purpleLight.g}, ${purpleLight.b}, 0.08), 0 0 10px -2px rgba(${purpleColor.r}, ${purpleColor.g}, ${purpleColor.b}, 0.12)`,
    };
  }

  const centerX = cardWidth.value / 2;
  const centerY = cardHeight.value / 2;

  // Pastikan tidak ada pembagian nol
  if (centerX === 0 || centerY === 0) {
    return {
      boxShadow: `0 0 20px 5px rgba(${purpleLight.r}, ${purpleLight.g}, ${purpleLight.b}, 0.08), 0 0 10px -2px rgba(${purpleColor.r}, ${purpleColor.g}, ${purpleColor.b}, 0.12)`,
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

  // Ambient shadow dengan warna furry purple - lebih besar dan lebih blur untuk efek ambient
  const ambientBlur = 50 * intensity;
  const ambientSpread = 12 * intensity;
  // Opacity untuk ambient shadow (lebih lembut)
  const ambientOpacity = isHovered.value ? 0.15 : 0.1;

  // Directional shadow yang mengikuti cursor dengan warna furry purple
  const directionalBlur = 25 * intensity;
  const directionalSpread = -8;
  // Opacity untuk directional shadow (lebih jelas)
  const directionalOpacity = isHovered.value ? 0.25 : 0.15;

  // Multiple shadows: ambient shadow (global) dengan warna ungu lembut + directional shadow (mengikuti cursor) dengan warna ungu
  const ambientShadow = `0 0 ${ambientBlur}px ${ambientSpread}px rgba(${purpleLight.r}, ${purpleLight.g}, ${purpleLight.b}, ${ambientOpacity})`;
  const directionalShadow = `${shadowX}px ${shadowY}px ${directionalBlur}px ${directionalSpread}px rgba(${purpleColor.r}, ${purpleColor.g}, ${purpleColor.b}, ${directionalOpacity})`;

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
