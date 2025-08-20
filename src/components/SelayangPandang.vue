<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Main Content -->
    <div class="lg:col-span-2">
      <!-- Hero Image -->
      <div
        v-if="image.split('/')[image.split('/').length - 1] != 'nopict.jpg'"
        class="mb-8 h-80 w-full overflow-hidden rounded shadow-lg"
      >
        <img :src="image" :alt="title" class="h-full w-full object-cover" />
      </div>

      <!-- Content Header -->
      <div class="mb-8">
        <h1 class="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
          {{ title }}
        </h1>
        <div class="text-portal-green mb-6 flex items-center text-2xl">
          <i class="bx bx-dots-horizontal-rounded"></i>
        </div>
      </div>

      <!-- Article Content -->
      <div class="mb-8 max-w-none">
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

<script setup lang="ts">
import BeritaSide from "@/components/BeritaSide.vue";
import NavigationContent from "@/components/NavigationContent.vue";

withDefaults(
  defineProps<{
    title: string;
    image: string;
    content: string;
  }>(),
  {
    image: "/dummy.jpg",
    title: "Lorem Ipsum Dolor Sit Amet",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
);
</script>
