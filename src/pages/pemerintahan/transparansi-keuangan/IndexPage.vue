<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="frame2 container">
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table id="myTable" class="table-striped table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Dokumen</th>
                    <th>Dokumen Transparansi Keuangan</th>
                    <th>Tanggal Publikasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Nama Dokumen</td>
                    <td>
                      <a class="btn btn-sm btn-success" href="#">LIHAT DATA</a>
                    </td>
                    <td>Tanggal Publikasi</td>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import BasePagination from "@/components/BasePagination.vue";
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
