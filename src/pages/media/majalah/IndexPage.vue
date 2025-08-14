<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <template v-if="majalahs.length > 0">
            <div v-for="majalah in majalahs" :key="majalah.id" class="col-md-12">
              <div class="post">
                <div>
                  <iframe width="100%" height="500px" :src="majalah.link" :frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="post-date-frame">
                  <span class="post-date"
                    ><i class="bx bx-calendar"></i> {{ formatters.date(majalah.created_at) }}</span
                  >
                </div>
                <a href="#" class="post-link">{{ majalah.judul }}</a>
                <div class="post-text">Sumber : diskominfo</div>
                <hr />
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
const majalahs = ref([
  {
    id: 1,
    judul: "Video Pembangunan Infrastruktur Kukar",
    link: "https://designrr.page/?id=303742&token=4169890919&type=FP&h=4040",
    created_at: new Date("2024-01-15"),
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

onMounted(() => {
  setPagination({
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 10,
  });
});
</script>
