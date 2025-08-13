<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="container frame2">
        <SelayangPandang title="PRESTASI DAN PENGHARGAAN PEMERINTAH KABUPATEN KUTAI KARTANEGARA">
          <template #content>
            <div class="table-responsive mt-4">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tahun</th>
                    <th>Nama</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1.</td>
                    <td>2024</td>
                    <td>Piala Presiden</td>
                    <td>Kabupaten Kutai Kartanegara memenangkan Piala Presiden dalam ajang lomba nasional.</td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>2024</td>
                    <td>Piala Presiden</td>
                    <td>Kabupaten Kutai Kartanegara memenangkan Piala Presiden dalam ajang lomba nasional.</td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>2024</td>
                    <td>Piala Presiden</td>
                    <td>Kabupaten Kutai Kartanegara memenangkan Piala Presiden dalam ajang lomba nasional.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <BasePagination
              :page="currentPage"
              :totalPages="totalPages"
              :itemsPerPage="itemsPerPage"
              :totalItems="totalItems"
              @previousPage="prevPage"
              @nextPage="nextPage"
            />
          </template>
        </SelayangPandang>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import BasePagination from "@/components/BasePagination.vue";
import SelayangPandang from "@/components/SelayangPandang.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";

import { usePagination } from "@/composables/usePagination";

const { currentPage, totalPages, itemsPerPage, totalItems, setPagination } = usePagination();

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
