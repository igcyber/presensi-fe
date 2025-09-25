<script setup lang="ts">
// No props needed for static election widget
</script>

<template>
  <!-- Election Info Sidebar -->
  <div class="lg:col-span-1">
    <div class="mb-6 flex items-center">
      <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
        <i class="bx bx-news text-lg"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900"><span class="font-normal">Info</span> Pemilu</h3>
    </div>

    <!-- Election Widget Container -->
    <div class="rounded bg-white p-6 shadow-md">
      <div id="gpr-kominfo-widget-container">
        <p class="text-gray-500">Loading...</p>
      </div>
    </div>
  </div>
</template>
