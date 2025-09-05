<script setup lang="ts">
interface Props {
  isLoading: boolean;
  loadingText?: string;
}

withDefaults(defineProps<Props>(), {
  loadingText: "Memuat...",
});
</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.loading-text {
  margin-top: 15px;
  color: #6c757d;
  font-size: 16px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
