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
        <div v-else-if="visi && misi">
          <SelayangPandang
            :title="visi?.slug || ''"
            :content="visi?.isi || ''"
            :image="`https://kukarkab.go.id/uploads/${visi?.foto}`"
          >
            <template #other>
              <div
                v-if="
                  `https://kukarkab.go.id/uploads/${misi?.foto}`.split('/')[
                    `https://kukarkab.go.id/uploads/${misi?.foto}`.split('/').length - 1
                  ] != 'nopict.jpg'
                "
                class="detail-image-frame"
              >
                <img :src="`https://kukarkab.go.id/uploads/${misi?.foto}`" class="detail-image" />
              </div>
              <div class="headingtext mt-3">
                <span class="headingtext-title"> {{ misi?.slug || "" }} </span>
                <i class="bx bx-dots-horizontal-rounded detail-divider"></i>
              </div>
              <div class="detail-text">
                <article v-html="misi?.isi || ''"></article>
              </div>
            </template>
          </SelayangPandang>
        </div>
        <div v-else class="alert alert-warning">
          <p>Data tidak ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { getVisiMisi, type VisiMisiData, type VisiMisiResponse } from "@/lib/api/pemerintahan";

const { data, isLoading, fetchData, isError, error } = useFetch<VisiMisiResponse, VisiMisiData>(getVisiMisi, {
  immediate: false,
  extractData: (response) => response.data,
});

const visi = computed(() => {
  return data.value?.visi;
});

const misi = computed(() => {
  return data.value?.misi;
});

onMounted(async () => {
  await fetchData();
});
</script>
