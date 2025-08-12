<script setup lang="ts">
import BeritaSide from "@/components/BeritaSide.vue";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb.vue";
</script>

<template>
  <div class="container-fluid navbreaker">
    <AppBreadcrumb />

    <div class="row">
      <div class="container frame2">
        <div class="row">
          <div class="col-md-8">
            <div class="detail-image-frame">
              <img src="/dummy.jpg" class="detail-image" />
            </div>
            <div class="headingtext">
              <span class="headingtext-title"> Prestasi dan Penghargaan </span>
              <i class="bx bx-dots-horizontal-rounded detail-divider"></i>
            </div>
            <div class="detail-text">
              <table class="table table-responsive">
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
            <div class="content">
              <a class="content-link active">Sejarah Kukar</a>
              <a class="content-link">Kependudukan</a>
              <a class="content-link">Potensi Daerah</a>
              <a class="content-link">Prestasi dan Penghargaan</a>
            </div>
          </div>

          <div class="col-md-4">
            <BeritaSide />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
