<script setup lang="ts">
import { ArrowRight, Calendar, User } from "lucide-vue-next";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { Pengaduan } from "@/lib/api/types/pengaduan.types";

interface Props {
  pengaduan: Pengaduan;
}

const props = defineProps<Props>();
const router = useRouter();
const { date } = useFormatters();

const statusConfig = computed(() => {
  switch (props.pengaduan.status) {
    case "belum":
      return { variant: "secondary" as const, label: "Belum Diproses" };
    case "diterima":
      return { variant: "default" as const, label: "Diterima" };
    case "selesai":
      return { variant: "destructive" as const, label: "Selesai" };
    default:
      return { variant: "secondary" as const, label: "Unknown" };
  }
});

const handleClick = () => {
  router.push({
    name: "pengaduan-masyarakat.pengaduan-langsung.detail",
    params: { id: props.pengaduan.id },
  });
};

const excerpt = computed(() => {
  const maxLength = 120;
  if (props.pengaduan.deskripsi.length <= maxLength) {
    return props.pengaduan.deskripsi;
  }
  return props.pengaduan.deskripsi.substring(0, maxLength) + "...";
});
</script>

<template>
  <Card
    class="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    @click="handleClick"
  >
    <CardContent class="flex h-full flex-col">
      <!-- Header -->
      <div class="mb-4 flex items-start justify-between">
        <div class="flex-1">
          <h3
            class="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-yellow-600"
          >
            {{ pengaduan.aduan }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <User class="h-4 w-4" />
            <span>{{ pengaduan.nama }}</span>
          </div>
        </div>
        <Badge :variant="statusConfig.variant" class="ml-2 flex-shrink-0">
          {{ statusConfig.label }}
        </Badge>
      </div>

      <!-- Category -->
      <div v-if="pengaduan.kategoriAduan" class="mb-3">
        <span class="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          {{ pengaduan.kategoriAduan }}
        </span>
      </div>

      <!-- Description -->
      <p class="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
        {{ excerpt }}
      </p>

      <!-- Footer -->
      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-500">
          <Calendar class="mr-1 h-4 w-4" />
          <time :datetime="pengaduan.createdAt">{{ date(pengaduan.createdAt) }}</time>
        </div>
        <div
          class="flex items-center text-sm font-medium text-yellow-600 transition-colors duration-200 group-hover:text-yellow-700"
        >
          Lihat Detail
          <ArrowRight class="ml-1 h-4 w-4" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
