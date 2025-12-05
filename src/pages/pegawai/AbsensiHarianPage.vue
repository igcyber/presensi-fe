<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <h1 class="text-3xl font-bold tracking-tight">Absensi Harian Pegawai 👋</h1>
      <p class="text-muted-foreground">Ini adalah halaman utama Anda untuk melakukan absensi.</p>

      <div class="rounded-lg border p-6">
        <p class="text-lg font-semibold">Selamat Datang, {{ $authStore.user?.nama }}!</p>
        <p class="text-muted-foreground">Kantor: {{ $authStore.user?.kantor }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";

// Akses store langsung di template jika sudah di-import/digunakan
const $authStore = useAuthStore();
</script>
