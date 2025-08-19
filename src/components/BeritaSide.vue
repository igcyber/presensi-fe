<template>
  <div>
    <form class="search-frame" method="GET">
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
      <span class="headingtext-title">
        <b><i class="bx bx-news"></i> Berita</b> Kabupaten
      </span>
      <br />
      <br />
    </div>

    <template v-if="isLoading">
      <div class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
    </template>
    <template v-else-if="isError">
      <div class="alert alert-danger">
        <h4>Error</h4>
        <p>{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
        <button class="btn btn-primary" @click="fetchData">Coba Lagi</button>
      </div>
    </template>

    <template v-else-if="data && data.length">
      <div v-for="post in data" :key="post.id" class="post--xs">
        <div class="post-image-frame">
          <img :src="`https://kukarkab.go.id/uploads/beritas/${post.foto}`" :alt="post.judul" class="post-image" />
        </div>
        <div class="post-content-frame">
          <div class="post-date-frame">
            <span class="post-date">
              <i class="bx bx-calendar"></i>
              {{ formatters.date(post.createdAt) }}
            </span>
          </div>
          <router-link :to="`/berita/${post.id}/${slugifyForUrl(post.judul)}`" class="post-link">{{
            post.judul
          }}</router-link>
          <hr />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="alert alert-warning">Data kosong</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { type BeritaSidebar, type BeritaSidebarResponse, getBeritaSidebar } from "@/lib/api/berita";

const { data, isLoading, fetchData, isError, error } = useFetch<BeritaSidebarResponse, BeritaSidebar[]>(
  () => getBeritaSidebar(),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const route = useRoute();
const formatters = useFormatters();

const keyword = ref<string>((route.query.keyword as string) ?? "");

watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = (val as string) ?? "";
  },
);

function slugifyForUrl(text: string): string {
  return text.replace(/[\s/]+/g, "-");
}

onMounted(async () => {
  await fetchData();
});
</script>
