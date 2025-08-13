<template>
  <div>
    <form class="search-frame" method="GET" @submit.prevent="onSearchSubmit">
      <input
        class="search-input"
        type="text"
        v-model="keyword"
        name="keyword"
        placeholder="Apa yang ingin anda cari?"
      />
      <input class="search-btn" type="submit" value="Cari" />
    </form>

    <div class="headingtext headingtext--sm">
      <span class="headingtext-title"
        ><b><i class="bx bx-news"></i> Berita</b> Kabupaten</span
      >
      <br /><br />
    </div>

    <template v-if="filteredPosts.length">
      <div v-for="post in filteredPosts" :key="post.id" class="post--xs">
        <div class="post-image-frame">
          <img :src="getImageSrc(post.foto)" :alt="post.judul" class="post-image" />
        </div>
        <div class="post-content-frame">
          <div class="post-date-frame">
            <span class="post-date">
              <i class="bx bx-calendar"></i>
              {{ formatters.date(post.created_at) }}
            </span>
          </div>
          <a :href="`/berita/${post.id}/${slugifyForUrl(post.judul)}`" class="post-link">{{ post.judul }}</a>
          <hr />
        </div>
      </div>
    </template>
    <template v-else> Data kosong </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFormatters } from "@/composables/useFormatters";

type PostItem = {
  id: number;
  judul: string;
  foto: string;
  created_at: Date;
};

const router = useRouter();
const route = useRoute();
const formatters = useFormatters();

const keyword = ref<string>((route.query.keyword as string) ?? "");

// Data dummy
const posts = ref<PostItem[]>([
  { id: 1, judul: "Pembangunan Infrastruktur Jalan di Kukar", foto: "dummy.jpg", created_at: new Date("2024-01-15") },
  { id: 2, judul: "Program Pemberdayaan UMKM Kukar", foto: "dummy.jpg", created_at: new Date("2024-01-12") },
  { id: 3, judul: "Prestasi Tim Olahraga Kukar", foto: "dummy.jpg", created_at: new Date("2024-01-10") },
  { id: 4, judul: "Peluncuran Program Digitalisasi Desa", foto: "dummy.jpg", created_at: new Date("2024-01-08") },
  { id: 5, judul: "Kunjungan Kerja Bupati ke Desa Terpencil", foto: "dummy.jpg", created_at: new Date("2024-01-05") },
  { id: 6, judul: "Festival Budaya Kutai Kartanegara", foto: "dummy.jpg", created_at: new Date("2024-01-03") },
]);

const filteredPosts = computed(() => {
  if (!keyword.value) return posts.value;
  const q = keyword.value.toLowerCase();
  return posts.value.filter((p) => p.judul.toLowerCase().includes(q));
});

function onSearchSubmit() {
  const query = keyword.value ? { keyword: keyword.value } : {};
  router.push({ path: "/berita", query });
}

watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = (val as string) ?? "";
  },
);

function getImageSrc(foto: string): string {
  // Gunakan aset dummy dari folder public
  return "/dummy.jpg";
}

function slugifyForUrl(text: string): string {
  return text.replace(/[\s/]+/g, "-");
}
</script>

<style scoped>
/* Tidak menambahkan style baru agar mengikuti kelas yang sudah ada di style.css */
</style>
