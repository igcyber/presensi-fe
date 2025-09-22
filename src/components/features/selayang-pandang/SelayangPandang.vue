<script setup lang="ts">
import BeritaSide from "@/components/features/berita/BeritaSide.vue";
import NavigationContent from "@/components/navigation/NavigationContent.vue";

withDefaults(
  defineProps<{
    title: string;
    image: string | null;
    content: string;
  }>(),
  {
    image: "/dummy.jpg",
    title: "Lorem Ipsum Dolor Sit Amet",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
);
</script>

<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Main Content -->
    <div class="lg:col-span-2">
      <!-- Hero Image -->
      <div
        v-if="image && image.split('/')[image.split('/').length - 1] != 'nopict.jpg'"
        class="mb-8 h-80 w-full overflow-hidden rounded shadow-lg"
      >
        <img :src="image" :alt="title" class="h-full w-full object-cover" />
      </div>

      <!-- Content Header -->
      <div class="mb-4">
        <h1 class="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
          {{ title }}
        </h1>
        <div class="text-portal-green flex items-center text-2xl">
          <i class="bx bx-dots-horizontal-rounded"></i>
        </div>
      </div>

      <!-- Article Content -->
      <div class="max-w-none">
        <article v-html="content" class="text-justify leading-relaxed text-gray-700"></article>

        <!-- Additional Content Slot -->
        <template v-if="$slots.content">
          <slot name="content" />
        </template>
      </div>

      <!-- Other Content Slot -->
      <div v-if="$slots.other" class="mt-8">
        <slot name="other" />
      </div>

      <!-- Navigation Content -->
      <div>
        <NavigationContent />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <div class="sticky top-45">
        <BeritaSide />
      </div>
    </div>
  </div>
</template>
