<template>
  <div class="row">
    <div class="col-md-8">
      <div v-if="props.image.split('/')[props.image.split('/').length - 1] != 'nopict.jpg'" class="detail-image-frame">
        <img :src="props.image" class="detail-image" />
      </div>
      <div class="headingtext">
        <span class="headingtext-title"> {{ props.title }} </span>
        <i class="bx bx-dots-horizontal-rounded detail-divider"></i>
      </div>
      <div class="detail-text">
        <article v-html="props.content"></article>

        <slot name="content" />
      </div>
      <NavigationContent />
    </div>

    <div class="col-md-4">
      <BeritaSide />
    </div>
  </div>
</template>

<script setup lang="ts">
import BeritaSide from "@/components/BeritaSide.vue";
import NavigationContent from "@/components/NavigationContent.vue";

const props = withDefaults(
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
