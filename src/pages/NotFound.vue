<script setup lang="ts">
import { ArrowLeft, Home, Search } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div class="w-full max-w-2xl">
      <Card class="border-0 shadow-2xl">
        <CardContent class="p-12 text-center">
          <!-- 404 Illustration -->
          <div class="mb-8">
            <div class="relative mx-auto mb-6 h-32 w-32">
              <!-- Outer circle -->
              <div class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-red-100 to-red-200"></div>
              <!-- Inner circle -->
              <div
                class="absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br from-red-200 to-red-300"
              >
                <span class="text-4xl font-bold text-red-600">4</span>
              </div>
              <!-- Zero -->
              <div
                class="absolute top-1/2 -right-2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-orange-300"
              >
                <span class="text-2xl font-bold text-orange-600">0</span>
              </div>
              <!-- Another zero -->
              <div
                class="absolute top-1/2 -right-8 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300"
              >
                <span class="text-xl font-bold text-yellow-600">4</span>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div class="mb-8">
            <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Oops! Halaman Tidak Ditemukan</h1>
            <p class="mb-2 text-lg text-gray-600">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
            <p class="text-sm text-gray-500">
              Mungkin halaman telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              @click="$router.push({ name: 'beranda.index' })"
              class="bg-portal-green hover:bg-portal-green/90 px-6 py-3 text-white"
            >
              <Home class="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>

            <Button @click="$router.go(-1)" variant="outline" class="border-gray-300 px-6 py-3 hover:bg-gray-50">
              <ArrowLeft class="mr-2 h-4 w-4" />
              Kembali Sebelumnya
            </Button>
          </div>

          <!-- Search Suggestion -->
          <div class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div class="mb-2 flex items-center justify-center">
              <Search class="mr-2 h-5 w-5 text-blue-600" />
              <h3 class="text-sm font-medium text-blue-800">Tips Pencarian</h3>
            </div>
            <p class="text-xs text-blue-700">
              Coba periksa URL atau gunakan menu navigasi untuk menemukan halaman yang Anda cari.
            </p>
          </div>

          <!-- Additional Help -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              Jika masalah berlanjut, silakan
              <a href="mailto:humaskukar@kukarkab.go.id" class="text-portal-green font-medium hover:underline">
                hubungi administrator
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
