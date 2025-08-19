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
          <div class="row align-items-center mb-3">
            <div class="col-md-3">
              <strong>Judul Dokumen</strong>
              :
            </div>

            <div class="col-md-9">
              {{ data.nama }}
            </div>
          </div>
          <div class="row align-items-center mb-3">
            <div class="col-md-3">
              <strong>Deskripsi</strong>
              :
            </div>
            <div class="col-md-9" v-html="data.keterangan"></div>
          </div>
          <div class="row align-items-center mb-3">
            <div class="col-md-3">
              <strong>Tanggal Publikasi</strong>
              :
            </div>
            <div class="col-md-9">
              {{ data.tanggalPublikasi ? formatters.date(data.tanggalPublikasi) : "" }}
            </div>
          </div>

          <div class="row align-items-center mb-3">
            <div class="col-md-3">
              <strong>File</strong>
              :
            </div>
            <div class="col-md-9">
              <a
                v-if="data.file"
                target="_blank"
                :href="`https://kukarkab.go.id/pemerintahan/transparansi-keuangan/download/${data.id}`"
              >
                <i class="bx bx-download"></i>
                {{ data.file }}
              </a>
              <br />
              <a v-if="data.link" target="_blank" :href="data.link">
                <i class="bx bx-link-external"></i>
                {{ data.link || "Tidak ada link" }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import {
  getTransparansiKeuanganDetail,
  type TransparansiKeuangan,
  type TransparansiKeuanganDetailResponse,
} from "@/lib/api/pemerintahan";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const formatters = useFormatters();

const { data, isLoading, fetchData, isError, error } = useFetch<
  TransparansiKeuanganDetailResponse,
  TransparansiKeuangan
>(() => getTransparansiKeuanganDetail(id), {
  immediate: false,
  extractData: (response) => response.data.data,
});

// Update breadcrumb context ketika data sudah ada
watch(
  () => data.value?.nama,
  (nama) => {
    if (nama) {
      setContext(nama);
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
