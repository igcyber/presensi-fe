<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div v-if="keyword && keyword !== ''" class="col-md-12">
                <div class="alert alert-success">
                  <i class="bx bx-search"></i>
                  {{ data?.beritas.length }} hasil pencarian untuk <b>"{{ keyword }}"</b>.
                </div>
              </div>

              <div class="col-md-12">
                <div v-if="isLoading" class="text-center">
                  <div class="spinner-border" role="status"></div>
                </div>
                <div v-else-if="isError" class="alert alert-danger">
                  <h4>Error</h4>
                  <p>{{ error?.message || "Terjadi kesalahan saat memuat data" }}</p>
                  <button class="btn btn-primary" @click="fetchData">Coba Lagi</button>
                </div>
                <template v-else-if="data">
                  <div class="row">
                    <div v-for="news in data.beritas" :key="news.id" class="col-md-4">
                      <div class="post">
                        <div class="post-image-frame">
                          <img
                            :src="`https://kukarkab.go.id/uploads/beritas/${news.foto}`"
                            :alt="news.judul"
                            class="post-image"
                          />
                        </div>
                        <router-link :to="getNewsDetailUrl(news.id, news.judul)" class="post-link">
                          {{ news.judul }}
                        </router-link>
                        <div class="post-date-frame">
                          <span class="post-date">
                            <i class="bx bx-calendar"></i>
                            {{ formatters.date(news.createdAt) }}
                          </span>
                        </div>
                        <div class="post-text" v-html="news.isi.split(' ').slice(0, 15).join(' ') + '...'"></div>
                        <hr />
                      </div>
                    </div>

                    <div v-if="data.beritas.length === 0" class="col-md-12">
                      <div class="p-4 text-center">
                        <i class="bx bx-news bx-lg text-muted"></i>
                        <p class="text-muted mt-2">Data kosong</p>
                      </div>
                    </div>

                    <div class="col-md-12 text-center">
                      <BasePagination
                        v-if="totalPages > 1"
                        :page="currentPage"
                        :items-per-page="itemsPerPage"
                        :total-items="totalItems"
                        :total-pages="totalPages"
                        @previousPage="prevPage"
                        @nextPage="nextPage"
                        @page="onPage"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import useFetch from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";
import { type BeritaListPayload, type BeritaResponse, getBeritaList } from "@/lib/api/berita";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Fetch dokumen data
const { data, isLoading, error, isError, fetchData } = useFetch<BeritaResponse, BeritaListPayload>(
  () => getBeritaList(currentPage.value),
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

const route = useRoute();

// Computed
const keyword = computed(() => (route.query.search as string) || "");

const getNewsDetailUrl = (id: number, title: string): string => {
  const slug = title.replace(/[ /%]/g, "-").toLowerCase();
  return `/berita/${id}/${slug}`;
};
</script>
