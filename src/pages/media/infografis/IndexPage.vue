<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <template v-if="infografis.length > 0">
            <div v-for="infografis in infografis" :key="infografis.id" class="col-md-4">
              <div class="info">
                <div class="info-image-frame">
                  <img :src="infografis.link" class="info-image" />
                  <div class="info-content">
                    <a :href="infografis.link" data-lightbox="banner" target="_blank" class="doc-link"
                      >Infografis {{ infografis.id }}</a
                    >
                    <span class="info-date">
                      <i class="bx bx-calendar"></i> {{ formatters.date(infografis.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="col-md-12">
              <div class="alert alert-warning">Data kosong</div>
            </div>
          </template>
          <div class="col-md-12">
            <BasePagination
              :page="currentPage"
              :totalPages="totalPages"
              :itemsPerPage="itemsPerPage"
              :totalItems="totalItems"
              @previousPage="prevPage"
              @nextPage="nextPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { useFormatters } from "@/composables/useFormatters";
import { usePagination } from "@/composables/usePagination";

const formatters = useFormatters();
const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

// Data dummy untuk video
const infografis = ref([
  {
    id: 1,
    judul: "Infografis 1",
    link: "/dummy.jpg",
    created_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    judul: "Infografis 2",
    link: "/dummy.jpg",
    created_at: new Date("2024-01-12"),
  },
  {
    id: 3,
    judul: "Infografis 3",
    link: "/dummy.jpg",
    created_at: new Date("2024-01-10"),
  },
  {
    id: 4,
    judul: "Infografis 4",
    link: "/dummy.jpg",
    created_at: new Date("2024-01-12"),
  },
]);

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

onMounted(async () => {
  setPagination({
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 10,
  });
});
</script>
