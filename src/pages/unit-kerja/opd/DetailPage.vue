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
          <div class="row">
            <div class="col-md-12">
              <RouterLink :to="{ name: 'unit-kerja.opd' }" class="headingtext-back"
                ><i class="bx bx-chevron-left"></i> Kembali</RouterLink
              >
              <br />
            </div>
            <div class="col-md-4">
              <div class="opd opd-detail">
                <div class="opd-image-frame">
                  <img :src="`https://kukarkab.go.id/uploads/${data.foto}`" class="opd-image" />
                </div>
              </div>
              <iframe class="opd-maps" :src="data.maps" style="border: 0" allowfullscreen loading="lazy"></iframe>
            </div>
            <div class="col-md-8">
              <div class="headingtext">
                <span class="headingtext-title"> <i class="bx bx-buildings"></i> {{ data.nama }} </span>
                <i class="bx bx-dots-horizontal-rounded detail-divider"></i>
              </div>
              <div class="detail-text" v-html="data.keterangan"></div>
              <div class="detail-text">
                <b><i class="bx bx-devices"></i> Aplikasi Terkait</b>
              </div>
              <br />
              <table class="table-hover table">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Keterangan</th>
                  <th>Logo</th>
                </tr>
                <tr v-for="(layanan, index) in data.layanans" :key="layanan.id">
                  <td>{{ index + 1 }}.</td>
                  <td>
                    {{ layanan.nama }}
                    <br />
                    <a :href="layanan.alamat" target="_blank" class="badge badge-success">{{ layanan.alamat }}</a>
                  </td>
                  <td v-html="layanan.keterangan"></td>
                  <td>
                    <a :href="layanan.alamat" target="_blank">
                      <img style="width: 80px" :src="`https://kukarkab.go.id/uploads/${layanan.logo}`" alt="" />
                    </a>
                  </td>
                </tr>
                <tr v-if="data.layanans.length === 0">
                  <td colspan="4">Data kosong</td>
                </tr>
              </table>
              <a :href="data.website" target="_blank" class="btn btn-warning">
                <i class="bx bx-world"></i>
                Kunjungi website
              </a>
            </div>
            <div class="col-md-12">
              <div class="content">
                <a class="content-link active">OPD</a>
                <a class="content-link">Perusahaan Daerah</a>
              </div>
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
import { getOpdDetail, type OpdDetail, type OpdDetailResponse } from "@/lib/api/unitKerja";

const route = useRoute();
const id = Number(route.params.id);

const { setContext, clearContext } = useBreadcrumb();

const { data, isLoading, fetchData, isError, error } = useFetch<OpdDetailResponse, OpdDetail>(() => getOpdDetail(id), {
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
