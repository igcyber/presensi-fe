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
        <div v-else-if="contentData">
          <SelayangPandang
            :title="contentData.slug"
            :content="contentData.isi"
            :image="`https://kukarkab.go.id/uploads/${contentData.foto}`"
          >
            <template #other>
              <div v-for="(item, index) in bupatiData" :key="index" class="col-md-4">
                <div class="bupati">
                  <div class="bupati-image-frame">
                    <img class="bupati-image" :src="`https://kukarkab.go.id/uploads/${item.foto}`" />
                  </div>
                  <div class="bupati-content-frame">
                    <p class="bupati-name">{{ item.namaBupati }} - {{ item.namaWakil }}</p>
                    <p class="bupati-periode mt-2">
                      <i class="bx bx-calendar"></i> {{ item.tahunAwal }}/{{ item.tahunAkhir }}
                    </p>
                  </div>
                </div>
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
import { type BupatiDataPayload, type BupatiResponse, getBupati } from "@/lib/api/pemerintahan";

const { data, isLoading, fetchData, isError, error } = useFetch<BupatiResponse, BupatiDataPayload>(getBupati, {
  immediate: false,
  extractData: (response) => response.data,
});

const contentData = computed(() => {
  return data.value?.data;
});

const bupatiData = computed(() => {
  return data.value?.bupati;
});

onMounted(async () => {
  await fetchData();
});
</script>
