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
            :title="data.data.slug"
            :content="data.data.isi"
            :image="`https://kukarkab.go.id/uploads/${data.data.foto}`"
          >
            <template #other>
              <div v-if="data.perusdas.length > 0" class="row">
                <div v-for="perusda in data.perusdas" :key="perusda.id" class="col-md-6">
                  <div class="bupati bupati--opd">
                    <div class="bupati-image-frame">
                      <img class="bupati-image" :src="`https://kukarkab.go.id/uploads/${perusda.foto}`" />
                    </div>
                    <div class="bupati-content-frame">
                      <RouterLink :to="{ name: 'unit-kerja.perusahaan-daerah' }" class="bupati-name">{{
                        perusda.nama
                      }}</RouterLink>
                      <table>
                        <tbody>
                          <tr>
                            <td style="vertical-align: text-top">
                              <i class="bx bx-globe bupati-icon"></i>
                            </td>
                            <td
                              class="bupati-textgrey"
                              style="word-wrap: break-word; word-break: break-all; white-space: normal"
                            >
                              <a :href="`tel:${perusda.telepon}`" class="badge badge-success">{{ perusda.telepon }}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="vertical-align: text-top"><i class="bx bx-map bupati-icon"></i></td>
                            <td
                              class="bupati-textgrey"
                              style="word-wrap: break-word; word-break: break-word; white-space: normal"
                            >
                              {{ perusda.alamat }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <BasePagination
                    :page="currentPage"
                    :totalPages="totalPages"
                    :itemsPerPage="itemsPerPage"
                    :totalItems="totalItems"
                    @previousPage="prevPage"
                    @nextPage="nextPage"
                    @page="onPage"
                  />
                </div>
              </div>
              <div v-else class="alert alert-info">
                <p>Data tidak ditemukan</p>
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
import { onMounted, watch } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";

import useFetch from "@/composables/useFetch";
import { usePagination } from "@/composables/usePagination";
import {
  getPerusahaanDaerah,
  type PerusahaanDaerahListPayload,
  type PerusahaanDaerahResponse,
} from "@/lib/api/unitKerja";

const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

const { data, isLoading, error, isError, fetchData } = useFetch<PerusahaanDaerahResponse, PerusahaanDaerahListPayload>(
  () => getPerusahaanDaerah(currentPage.value),
  {
    immediate: false,
    extractData: (response) => response.data,
  },
);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const onPage = (page: number) => {
  currentPage.value = page;
};

// Watchers
watch(currentPage, () => {
  fetchData();

  window.scrollTo({ top: 0, behavior: "smooth" });
});

onMounted(async () => {
  await fetchData();

  setPagination({
    currentPage: data.value?.meta?.current_page ?? 1,
    totalPages: data.value?.meta?.last_page ?? 1,
    totalItems: data.value?.meta?.total ?? 0,
    itemsPerPage: data.value?.meta?.per_page ?? 10,
  });
});
</script>
