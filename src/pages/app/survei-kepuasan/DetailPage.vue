<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import SurveiKepuasanDetailView from "@/components/features/surveiKepuasan/SurveiKepuasanDetailView.vue";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { getSurveiKepuasanById } from "@/lib/api/services/surveiKepuasan";
import type { SurveiKepuasanDetailResponse } from "@/lib/api/types/surveiKepuasan.types";

const route = useRoute();
const router = useRouter();

const surveiKepuasanId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<SurveiKepuasanDetailResponse>,
  SurveiKepuasanDetailResponse
>(() => getSurveiKepuasanById(surveiKepuasanId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail survei kepuasan", {
      description: error.message,
    });
  },
});

const handleBack = () => {
  router.push({ name: "app.survei-kepuasan" });
};

onMounted(() => {
  if (surveiKepuasanId.value > 0) {
    fetchData();
  } else {
    toast.error("ID survei kepuasan tidak valid");
    handleBack();
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail survei kepuasan...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail survei kepuasan'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <SurveiKepuasanDetailView :survei-kepuasan="data" :show-back-button="true" @back="handleBack" />
    </div>
  </div>
</template>
