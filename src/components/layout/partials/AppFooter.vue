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

<template>
  <footer class="bg-portal-blue-dark text-white">
    <div class="container py-16">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <!-- Logo Section -->
        <div class="lg:col-span-1">
          <div class="space-y-4">
            <img class="h-12 w-auto" src="/assets/images/logos/logo-white.png" alt="Logo Kukar" />
            <img class="w-full max-w-40" src="/assets/images/logos/logo-pse.png" alt="PSE" />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="lg:col-span-1">
          <h3 class="mb-6 text-xl font-bold text-white">Terhubung</h3>

          <div class="space-y-4">
            <div class="text-gray-300">
              <div class="mb-2 flex items-start gap-2">
                <i class="bx bx-envelope text-portal-green mt-1"></i>
                <div>
                  <span class="font-semibold text-white">Email:</span><br />
                  <a :href="`mailto:${footerInfo.email}`" class="hover:text-portal-green transition-colors">
                    {{ footerInfo.email }}
                  </a>
                </div>
              </div>

              <div class="mb-4 flex items-start gap-2">
                <i class="bx bx-map text-portal-green mt-1"></i>
                <div>
                  <span class="font-semibold text-white">Alamat:</span><br />
                  {{ footerInfo.alamat }}
                </div>
              </div>

              <div class="mb-4 flex items-start gap-2">
                <i class="bx bx-phone-call text-portal-green mt-1"></i>
                <div>
                  <span class="font-semibold text-white">Telepon:</span><br />
                  {{ footerInfo.telepon }}
                </div>
              </div>

              <div class="mb-4 flex items-start gap-2">
                <i class="bx bx-printer text-portal-green mt-1"></i>
                <div>
                  <span class="font-semibold text-white">Fax:</span><br />
                  {{ footerInfo.fax }}
                </div>
              </div>
            </div>
          </div>

          <hr class="my-6 border-gray-600" />
        </div>

        <!-- Related Links -->
        <div class="lg:col-span-2">
          <h3 class="mb-6 text-xl font-bold text-white">Link Terkait</h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              v-for="link in relatedLinks"
              :key="link.id"
              :href="link.website"
              class="text-sm text-gray-300 transition-colors hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.nama }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="bg-opacity-30 bg-portal-black py-6">
      <div class="container">
        <div class="text-center text-sm text-gray-400">
          <p>
            © {{ currentYear }} Kabupaten Kutai Kartanegara All Rights Reserved - Developed by
            <a
              href="https://diskominfo.kukarkab.go.id/"
              class="text-gray-300 transition-colors hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Diskominfo Kukar
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
