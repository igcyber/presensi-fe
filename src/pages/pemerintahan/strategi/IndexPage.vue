<template>
  <div class="container-fluid navbreaker">
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
        <div v-else-if="data">
          <SelayangPandang
            :title="data.slug"
            :content="data.isi"
            :image="`https://kukarkab.go.id/uploads/${data.foto}`"
          />
        </div>
        <div v-else class="alert alert-warning">
          <p>Data tidak ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { getStrategiDaerah, type StrategiDaerahData, type StrategiDaerahResponse } from "@/lib/api/pemerintahan";

const { data, isLoading, fetchData, isError, error } = useFetch<StrategiDaerahResponse, StrategiDaerahData>(
  getStrategiDaerah,
  {
    immediate: false,
    extractData: (response) => response.data.data,
  },
);

onMounted(async () => {
  await fetchData();
});
</script>
