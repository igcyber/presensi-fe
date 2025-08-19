<template>
  <div class="container-fluid navbreaker">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else-if="isError" class="alert alert-danger">
          <h4>Error</h4>
          <p>{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
          <button class="btn btn-primary" @click="fetchData">Coba Lagi</button>
        </div>
        <div v-else-if="data" class="row">
          <div class="col-md-12">
            <RouterLink :to="{ name: 'berita.index' }" class="headingtext-back"
              ><i class="bx bx-chevron-left"></i> Kembali</RouterLink
            >
            <br />
          </div>

          <div class="col-md-8">
            <div class="detail-image-frame">
              <img :src="`https://kukarkab.go.id/uploads/beritas/${data?.foto}`" class="detail-image" />
            </div>
            <div class="post post-detail">
              <div class="post-date-frame">
                <span class="post-date"><i class="bx bx-calendar"></i> {{ formatters.date(data?.createdAt) }}</span>
              </div>
              <p class="post-link">{{ data?.judul }}</p>
              <div class="post-tag">
                <span class="post-tag-icon"><i class="bx bx-buildings"></i> </span>
                {{ data?.opd?.nama || "Kukarkab" }}
              </div>
              <div class="post-text" v-html="data?.isi"></div>
              <br />
              <hr />
              <ShareLink :url="formatters.getNewsDetailUrl(data?.id, data?.judul)" />
            </div>
          </div>
          <div class="col-md-4">
            <BeritaSide />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import BeritaSide from "@/components/BeritaSide.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import ShareLink from "@/components/ShareLink.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { type BeritaDetail, type BeritaDetailResponse, getBeritaDetail } from "@/lib/api/berita";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const formatters = useFormatters();

const { data, isLoading, fetchData, isError, error } = useFetch<BeritaDetailResponse, BeritaDetail>(
  () => getBeritaDetail(id),
  {
    immediate: false,
    extractData: (response) => response.data.data,
  },
);

// Update breadcrumb context ketika data sudah ada
watch(
  () => data.value?.judul,
  (judul) => {
    if (judul) {
      setContext(judul);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await fetchData();
});

onBeforeUnmount(() => {
  // Opsional: bersihkan agar tidak "nyangkut" ke halaman lain
  clearContext();
});
</script>
