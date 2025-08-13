<template>
  <div class="container-fluid">
    <div class="row frame footer1">
      <div class="container">
        <div class="row">
          <!-- Logo Section -->
          <div class="col-md-3 mb-md-0 mb-5">
            <img class="footer-logo" src="/logo-white.png" alt="Logo Kukar" />
            <img class="footer-pse" src="/pse.png" alt="PSE" />
          </div>

          <!-- Contact Information -->
          <div class="col-md-3">
            <div class="row">
              <div class="col-md-12">
                <p class="footer-title">Terhubung</p>
              </div>
            </div>
            <p class="footer-text">
              <b><i class="bx bx-envelope"></i> Email:</b><br />
              {{ footerInfo.email }}
            </p>
            <p class="footer-text">
              <b><i class="bx bx-map"></i> Alamat:</b><br />
              {{ footerInfo.alamat }}
            </p>
            <br />
            <p class="footer-text"><b>Telp.</b> {{ footerInfo.telepon }}</p>
            <p class="footer-text"><b>Fax.</b> {{ footerInfo.fax }}</p>
            <hr class="footer-hr" />
          </div>

          <!-- Related Links -->
          <div class="col-md-6">
            <div class="row mb-4">
              <div class="col-md-12">
                <p class="footer-title">Link Terkait</p>
              </div>
              <div v-for="link in relatedLinks" :key="link.id" class="col-md-4">
                <a :href="link.website" class="footer-text" target="_blank" rel="noopener noreferrer">
                  {{ link.nama }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="container-fluid">
        <div class="row copyright">
          <div class="container text-center">
            <p>
              © {{ currentYear }} Kabupaten Kutai Kartanegara All Rights Reserved - Developed by
              <a href="https://diskominfo.kukarkab.go.id/">Diskominfo Kukar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

// Import composable
import { useAppData } from "@/composables/useAppData";

// Get data from composable
const { footerInfo, relatedLinks } = useAppData();

// Computed properties
const currentYear = computed(() => new Date().getFullYear());

// Lifecycle hooks
onMounted(() => {
  // In real app, you would fetch related links from API here
  // fetchRelatedLinks()
});
</script>
