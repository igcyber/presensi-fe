<script setup lang="ts">
// No props needed for static features
</script>

<template>
  <!-- Features Section -->
  <section class="bg-[#fcfcfc] py-16">
    <div class="container">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Feature 1: Publikasi Statistik -->
        <div
          class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
        >
          <div class="flex items-center">
            <div
              class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white"
            >
              <i class="bx bx-chart text-2xl"></i>
            </div>
            <div>
              <a
                href="https://kukarkab.bps.go.id"
                target="_blank"
                rel="noopener noreferrer"
                class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600"
              >
                Publikasi Statistik
              </a>
              <p class="text-sm text-gray-500">www.kukarkab.bps.go.id</p>
            </div>
          </div>
        </div>

        <!-- Feature 2: Transparansi Keuangan -->
        <div
          class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
        >
          <div class="flex items-center">
            <div
              class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white"
            >
              <i class="bx bx-wallet text-2xl"></i>
            </div>
            <div>
              <RouterLink
                to="/pemerintahan/transparansi-keuangan"
                class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-green-600"
              >
                Transparansi Keuangan
              </RouterLink>
              <p class="text-sm text-gray-500">www.kukarkab.go.id</p>
            </div>
          </div>
        </div>

        <!-- Feature 3: SPAN LAPOR -->
        <div
          class="group flex items-center justify-start rounded bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:justify-center"
        >
          <div class="flex items-center">
            <div
              class="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white"
            >
              <i class="bx bx-chat text-2xl"></i>
            </div>
            <div>
              <a
                href="https://lapor.go.id"
                target="_blank"
                rel="noopener noreferrer"
                class="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-orange-600"
              >
                SPAN LAPOR!
              </a>
              <p class="text-sm text-gray-500">www.lapor.go.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
