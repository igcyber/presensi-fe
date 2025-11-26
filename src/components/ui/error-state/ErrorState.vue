<script setup lang="ts">
import { AlertTriangle, RefreshCw } from "lucide-vue-next";
import { computed } from "vue";

import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  message?: string;
  showRetry?: boolean;
  retryText?: string;
  variant?: "error" | "warning" | "info";
}

const props = withDefaults(defineProps<Props>(), {
  title: "Terjadi Kesalahan",
  message: "Gagal memuat data",
  showRetry: true,
  retryText: "Coba Lagi",
  variant: "error",
});

const emit = defineEmits<{
  retry: [];
}>();

const handleRetry = () => {
  emit("retry");
};

const iconClass = computed(() => {
  switch (props.variant) {
    case "warning":
      return "text-yellow-600";
    case "info":
      return "text-blue-500";
    default:
      return "text-destructive";
  }
});

const bgClass = computed(() => {
  switch (props.variant) {
    case "warning":
      return "bg-white border-yellow-200";
    case "info":
      return "bg-white border-blue-200";
    default:
      return "bg-white border-portal-black";
  }
});
</script>

<template>
  <div class="py-8 text-center">
    <div :class="bgClass" class="mx-auto mb-6 max-w-md rounded-lg border p-6">
      <div :class="iconClass" class="mb-4">
        <AlertTriangle class="mx-auto h-12 w-12" />
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p class="mb-4 text-gray-600">{{ message }}</p>
      <Button v-if="showRetry" @click="handleRetry" variant="outline" class="gap-2">
        <RefreshCw class="h-4 w-4" />
        {{ retryText }}
      </Button>
    </div>
  </div>
</template>
