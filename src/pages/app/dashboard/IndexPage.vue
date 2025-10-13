<script setup lang="ts">
import {
  BookOpen,
  FileText,
  Image,
  NewspaperIcon,
  PlusIcon,
  Settings,
  VideoIcon,
} from "lucide-vue-next";
import { computed } from "vue";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFetch } from "@/composables/useFetch";
import { getDashboard } from "@/lib/api/services";
import type { DashboardData } from "@/lib/api/types/dashboard.types";
import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { RouterLink } from "vue-router";

// Fetch data dari API Dashboard
const { data: dashboardResponse, isLoading } = useFetch<ApiResponse<DashboardData>, ApiResponse<DashboardData>>(
  () => getDashboard(),
  {
    immediate: true,
    onSuccess: (data) => {
      console.log("Dashboard data loaded:", data);
    },
  },
);

// Computed untuk dashboard data
const dashboardData = computed(() => {
  if (!dashboardResponse.value || !dashboardResponse.value.data) {
    return {
      views: {
        berita: 0,
        dokumen: 0,
        infografis: 0,
        video: 0,
        foto: 0,
      },
      popular: {
        berita: [],
      },
    };
  }
  return dashboardResponse.value.data;
});

// Data statistik views
const stats = computed(() => [
  {
    title: "Views Berita",
    value: dashboardData.value.views.berita.toLocaleString("id-ID"),
    icon: NewspaperIcon,
    color: "blue",
  },
  {
    title: "Views Dokumen",
    value: dashboardData.value.views.dokumen.toLocaleString("id-ID"),
    icon: FileText,
    color: "green",
  },
  {
    title: "Views Infografis",
    value: dashboardData.value.views.infografis.toLocaleString("id-ID"),
    icon: BookOpen,
    color: "orange",
  },
  {
    title: "Views Video",
    value: dashboardData.value.views.video.toLocaleString("id-ID"),
    icon: VideoIcon,
    color: "purple",
  },
  {
    title: "Views Foto",
    value: dashboardData.value.views.foto.toLocaleString("id-ID"),
    icon: Image,
    color: "pink",
  },
]);

// Data berita populer sebagai aktivitas terbaru
const recentActivities = computed(() => {
  console.log("Dashboard Data:", dashboardData.value);
  console.log("Popular Berita:", dashboardData.value.popular?.berita);

  if (!dashboardData.value.popular?.berita || dashboardData.value.popular.berita.length === 0) {
    console.log("No popular berita found");
    return [];
  }

  return dashboardData.value.popular.berita.map((berita) => ({
    id: berita.id,
    type: "berita",
    title: berita.judul,
    description: berita.isi.substring(0, 100) + "...",
    time: new Date(berita.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    icon: NewspaperIcon,
    color: "blue",
    image: berita.fotoUrl,
    tags: [`Tag ${berita.tagId}`],
    views: berita.views,
  }));
});
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-[400px] items-center justify-center">
      <div class="text-center">
        <div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p class="text-muted-foreground">Memuat data dashboard...</p>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- Header Section -->
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">Ringkasan data yang sering diakses</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="stat in stats"
          :key="stat.title"
          class="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <p class="text-muted-foreground text-sm font-medium">{{ stat.title }}</p>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
              </div>
              <div
                :class="[
                  'rounded-full p-3 transition-colors duration-200',
                  stat.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/20',
                  stat.color === 'green' && 'bg-green-100 dark:bg-green-900/20',
                  stat.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/20',
                  stat.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/20',
                ]"
              >
                <component
                  :is="stat.icon"
                  :class="[
                    'h-6 w-6',
                    stat.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                    stat.color === 'green' && 'text-green-600 dark:text-green-400',
                    stat.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                    stat.color === 'purple' && 'text-purple-600 dark:text-purple-400',
                  ]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Popular News -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-xl font-semibold">Berita Populer</CardTitle>
                  <CardDescription class="mt-1">
                    Berita yang paling banyak dilihat
                    <span v-if="recentActivities.length > 0" class="ml-1">
                      ({{ recentActivities.length }} berita)
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" as-child>
                  <RouterLink to="/app/berita"> Lihat Semua </RouterLink>
                </Button>
              </div>
            </CardHeader>
            <CardContent class="p-0">
              <!-- Pesan ketika tidak ada berita -->
              <div v-if="recentActivities.length === 0" class="p-6 text-center">
                <p class="text-muted-foreground">Belum ada berita populer</p>
              </div>

              <!-- Daftar berita populer dengan scroll -->
              <div v-else class="max-h-[600px] divide-y overflow-y-auto">
                <RouterLink
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :to="`/app/berita/${activity.id}`"
                  class="hover:bg-muted/50 flex items-start gap-4 p-6 transition-colors cursor-pointer"
                >
                  <div v-if="activity.image" class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img :src="activity.image" :alt="activity.title" class="h-full w-full object-cover" />
                  </div>
                  <div
                    v-else
                    :class="[
                      'rounded-full p-2',
                      activity.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/20',
                      activity.color === 'green' && 'bg-green-100 dark:bg-green-900/20',
                      activity.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/20',
                      activity.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/20',
                    ]"
                  >
                    <component
                      :is="activity.icon"
                      :class="[
                        'h-4 w-4',
                        activity.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                        activity.color === 'green' && 'text-green-600 dark:text-green-400',
                        activity.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                        activity.color === 'purple' && 'text-purple-600 dark:text-purple-400',
                      ]"
                    />
                  </div>
                  <div class="flex-1 space-y-2">
                    <p class="font-medium">{{ activity.title }}</p>
                    <p class="text-muted-foreground text-sm">{{ activity.description }}</p>
                    <div class="flex items-center gap-2">
                      <Badge
                        v-for="tag in activity.tags"
                        :key="tag"
                        variant="secondary"
                        class="text-xs"
                      >
                        {{ tag }}
                      </Badge>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-muted-foreground text-xs">{{ activity.time }}</p>
                      <p class="text-muted-foreground text-xs">{{ activity.views }} views</p>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg font-semibold">Aksi Cepat</CardTitle>
              <CardDescription>Akses fitur yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button class="w-full justify-start" variant="ghost">
                <PlusIcon class="mr-3 h-4 w-4" />
                Tambah Pengguna
              </Button>
              <Button class="w-full justify-start" variant="ghost">
                <Settings class="mr-3 h-4 w-4" />
                Pengaturan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
