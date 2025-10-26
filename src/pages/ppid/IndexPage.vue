<script setup lang="ts">
import { Calendar, Clock, FileText, Shield, TrendingUp } from "lucide-vue-next";
import { useRouter } from "vue-router";

import AppBreadcrumb from "@/components/layout/partials/AppBreadcrumb.vue";

const router = useRouter();

// PPID Categories Data
const ppidCategories = [
  {
    id: "informasi-berkala",
    title: "Informasi Berkala",
    description: "Informasi yang wajib disediakan dan diumumkan secara berkala",
    icon: Calendar,
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    hoverColor: "hover:bg-blue-100",
  },
  {
    id: "informasi-dikecualikan",
    title: "Informasi Dikecualikan",
    description: "Informasi yang dikecualikan untuk diakses oleh publik",
    icon: Shield,
    gradient: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    hoverColor: "hover:bg-red-100",
  },
  {
    id: "informasi-serta-merta",
    title: "Informasi Serta Merta",
    description: "Informasi yang wajib diumumkan segera setelah peristiwa terjadi",
    icon: TrendingUp,
    gradient: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    hoverColor: "hover:bg-green-100",
  },
  {
    id: "informasi-setiap-saat",
    title: "Informasi Setiap Saat",
    description: "Informasi yang wajib tersedia setiap saat dan dapat diakses publik",
    icon: Clock,
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    hoverColor: "hover:bg-purple-100",
  },
];

const navigateToCategory = (categoryId: string) => {
  router.push({ name: "ppid.kategori", params: { type: categoryId } });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <AppBreadcrumb />

    <!-- Main Content -->
    <main class="py-12">
      <div class="container">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900">Pejabat Pengelola Informasi dan Dokumentasi (PPID)</h1>
          <p class="mx-auto max-w-3xl text-lg text-gray-600">
            Akses informasi publik berdasarkan kategori sesuai dengan Undang-Undang Keterbukaan Informasi Publik
          </p>
        </div>

        <!-- PPID Categories Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="category in ppidCategories"
            :key="category.id"
            @click="navigateToCategory(category.id)"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-yellow-600/20"
          >
            <!-- Icon Section -->
            <div class="relative p-8 text-center">
              <div
                class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110"
                :class="category.gradient"
              >
                <component :is="category.icon" class="h-10 w-10 text-white" />
              </div>

              <!-- Title -->
              <h3
                class="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-yellow-600"
              >
                {{ category.title }}
              </h3>

              <!-- Description -->
              <p class="text-sm leading-relaxed text-gray-600">
                {{ category.description }}
              </p>
            </div>

            <!-- Hover Effect Background -->
            <div
              class="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5"
              :class="category.bgColor"
            ></div>

            <!-- Arrow Icon -->
            <div
              class="absolute right-4 bottom-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-white">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mt-16 rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100 p-8 text-center">
          <FileText class="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <h3 class="mb-4 text-2xl font-bold text-gray-900">Tentang PPID</h3>
          <p class="mx-auto max-w-3xl leading-relaxed text-gray-700">
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah pejabat yang bertanggung jawab di bidang
            penyimpanan, pendokumentasian, dan/atau pelayanan informasi di badan publik. PPID bertugas melayani
            permintaan informasi sesuai dengan ketentuan peraturan perundang-undangan.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
