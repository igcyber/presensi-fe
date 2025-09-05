<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  items: any[];
  itemsPerView?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  responsive?: {
    [breakpoint: number]: {
      itemsPerView: number;
    };
  };
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerView: 3,
  autoplay: false,
  autoplayDelay: 3000,
  showNavigation: true,
  showDots: true,
  responsive: () => ({}),
});

const carouselContainer = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const autoplayInterval = ref<ReturnType<typeof setInterval> | null>(null);
const currentItemsPerView = ref(props.itemsPerView);
const isOddBeforeLast = ref(false);

// Computed
const maxIndex = computed(() => Math.max(0, props.items.length - currentItemsPerView.value));

const totalSlides = computed(() => Math.ceil(props.items.length / currentItemsPerView.value));

const currentSlideIndex = computed(() => {
  if (isOddBeforeLast.value) {
    return totalSlides.value - 1;
  }
  return Math.floor(currentIndex.value / currentItemsPerView.value);
});

// Methods
const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++;

    // Check if we've reached the last slide with odd number of items
    const remainingItems = props.items.length % currentItemsPerView.value;
    if (remainingItems !== 0 && currentIndex.value === maxIndex.value) {
      isOddBeforeLast.value = true;
    } else {
      isOddBeforeLast.value = false;
    }
  } else {
    // Loop back to start
    currentIndex.value = 0;
    isOddBeforeLast.value = false;
  }
};

const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;

    // Check if we're at the last slide with odd number of items
    const remainingItems = props.items.length % currentItemsPerView.value;
    if (remainingItems !== 0 && currentIndex.value === maxIndex.value) {
      isOddBeforeLast.value = true;
    } else {
      isOddBeforeLast.value = false;
    }
  }
};

const goToSlide = (index: number) => {
  // Jika ini adalah slide terakhir dan jumlah item tidak habis dibagi
  if (index === totalSlides.value - 1) {
    const remainingItems = props.items.length % currentItemsPerView.value;

    // Jika ada sisa item (ganjil), sesuaikan posisi agar tidak ada slot kosong
    if (remainingItems !== 0) {
      // Posisikan agar item terakhir berada di ujung kanan
      currentIndex.value = props.items.length - currentItemsPerView.value;
      isOddBeforeLast.value = true;
    } else {
      // Jika genap, gunakan perhitungan normal
      currentIndex.value = index * currentItemsPerView.value;
      isOddBeforeLast.value = false;
    }
  } else {
    // Untuk slide selain yang terakhir, gunakan perhitungan normal
    currentIndex.value = index * currentItemsPerView.value;
    isOddBeforeLast.value = false;
  }

  // Pastikan index tidak melebihi batas maksimum
  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
};

// Responsive handling
const updateItemsPerView = () => {
  const width = window.innerWidth;

  let newItemsPerView = props.itemsPerView;

  // Apply responsive settings
  const sortedBreakpoints = Object.keys(props.responsive)
    .map(Number)
    .sort((a, b) => b - a);

  for (const breakpoint of sortedBreakpoints) {
    if (width >= breakpoint) {
      newItemsPerView = props.responsive[breakpoint].itemsPerView;
      break;
    }
  }

  currentItemsPerView.value = newItemsPerView;

  // Adjust current index if needed
  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
};

// Autoplay
const startAutoplay = () => {
  if (props.autoplay && props.items.length > currentItemsPerView.value) {
    autoplayInterval.value = setInterval(nextSlide, props.autoplayDelay);
  }
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

// Watchers
watch(
  () => props.items,
  () => {
    currentIndex.value = 0;
    stopAutoplay();
    startAutoplay();
  },
);

watch(
  () => props.autoplay,
  (newVal) => {
    if (newVal) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  },
);

// Lifecycle
onMounted(() => {
  updateItemsPerView();
  window.addEventListener("resize", updateItemsPerView);
  startAutoplay();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateItemsPerView);
  stopAutoplay();
});

// Expose methods for external control
defineExpose({
  nextSlide,
  previousSlide,
  goToSlide,
  currentIndex: () => currentIndex.value,
});
</script>

<template>
  <div class="relative">
    <!-- Carousel Container -->
    <div class="overflow-hidden rounded pb-5">
      <div
        ref="carouselContainer"
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex-shrink-0"
          :style="{ width: `${100 / currentItemsPerView}%` }"
        >
          <div class="px-2">
            <slot :item="item" :index="index"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <template v-if="showNavigation && items.length > currentItemsPerView">
      <!-- Previous Button -->
      <button
        v-if="currentIndex > 0"
        @click="previousSlide"
        class="absolute top-1/2 -left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <i class="bx bx-chevron-left text-xl"></i>
      </button>

      <!-- Next Button -->
      <button
        @click="nextSlide"
        class="absolute top-1/2 -right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <i class="bx bx-chevron-right text-xl"></i>
      </button>
    </template>
  </div>
</template>
