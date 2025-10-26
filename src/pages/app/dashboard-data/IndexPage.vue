<script setup lang="ts">
import {
  BarChart3Icon,
  BookOpen,
  Eye,
  FileText,
  Image,
  NewspaperIcon,
  RefreshCwIcon,
  VideoIcon,
} from "lucide-vue-next";
import { computed } from "vue";
import { RouterLink } from "vue-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DoughnutChart } from "@/components/ui/charts";

import { useFetch } from "@/composables/useFetch";
import { useFormatters } from "@/composables/useFormatters";
import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { getDashboard } from "@/lib/api/services";
import type { DashboardData } from "@/lib/api/types/dashboard.types";
import { contentTypeLabels, getMainColors } from "@/lib/utils/chartConfig";

// Formatters
const { date } = useFormatters();

// Fetch data dari API Dashboard
const {
  data: dashboardResponse,
  isLoading,
  refresh,
} = useFetch<ApiResponse<DashboardData>, ApiResponse<DashboardData>>(() => getDashboard(), {
  immediate: true,
});

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
    title: "Views JDIH",
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

// Total views
const totalViews = computed(() => {
  const views = dashboardData.value.views;
  return (
    parseInt(views.berita as any) +
    parseInt(views.dokumen as any) +
    parseInt(views.infografis as any) +
    parseInt(views.video as any) +
    parseInt(views.foto as any)
  );
});

// Data untuk Doughnut Chart
const doughnutChartData = computed(() => {
  const views = dashboardData.value.views;
  return [views.berita, views.dokumen, views.infografis, views.video, views.foto];
});

const doughnutChartLabels = computed(() => {
  return [
    contentTypeLabels.berita,
    contentTypeLabels.dokumen,
    contentTypeLabels.infografis,
    contentTypeLabels.video,
    contentTypeLabels.foto,
  ];
});

// Data untuk Bar Chart
const barChartData = computed(() => {
  const views = dashboardData.value.views;
  return [views.berita, views.dokumen, views.infografis, views.video, views.foto];
});

const barChartLabels = computed(() => {
  return [
    contentTypeLabels.berita,
    contentTypeLabels.dokumen,
    contentTypeLabels.infografis,
    contentTypeLabels.video,
    contentTypeLabels.foto,
  ];
});

// Data berita populer
const popularNews = computed(() => {
  if (!dashboardData.value.popular?.berita || dashboardData.value.popular.berita.length === 0) {
    return [];
  }

  return dashboardData.value.popular.berita.map((berita) => ({
    id: berita.id,
    title: berita.judul,
    description: berita.isi,
    date: berita.createdAt,
    image: berita.fotoUrl,
    views: berita.views,
  }));
});

// Check if has data
const hasData = computed(() => totalViews.value >= 0);

// Handle refresh
const handleRefresh = () => {
  refresh();
};
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-[400px] items-center justify-center">
      <div class="text-center">
        <div
          class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        <p class="text-muted-foreground">Memuat data dashboard...</p>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Dashboard Data</h1>
          <p class="text-muted-foreground">Visualisasi data views dan konten populer</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" class="flex items-center gap-2" @click="handleRefresh">
            <RefreshCwIcon class="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  stat.color === 'pink' && 'bg-pink-100 dark:bg-pink-900/20',
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
                    stat.color === 'pink' && 'text-pink-600 dark:text-pink-400',
                  ]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="!hasData" class="flex min-h-[400px] items-center justify-center">
        <div class="text-center">
          <BarChart3Icon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 class="mb-2 text-lg font-semibold">Belum Ada Data</h3>
          <p class="text-muted-foreground">Data views akan muncul setelah ada aktivitas</p>
        </div>
      </div>

      <!-- Charts Grid -->
      <div v-else class="grid gap-6 lg:grid-cols-2">
        <!-- Doughnut Chart - Views Distribution -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BarChart3Icon class="h-5 w-5" />
              Distribusi Views
            </CardTitle>
            <CardDescription>
              Total views: <strong>{{ totalViews }}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent class="pt-6">
            <DoughnutChart
              :data="doughnutChartData"
              :labels="doughnutChartLabels"
              :colors="getMainColors()"
              :height="320"
            />
          </CardContent>
        </Card>

        <!-- Bar Chart - Comparison -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BarChart3Icon class="h-5 w-5" />
              Perbandingan Views
            </CardTitle>
            <CardDescription> Visualisasi perbandingan views antar tipe konten </CardDescription>
          </CardHeader>
          <CardContent class="pt-6">
            <BarChart
              :data="barChartData"
              :labels="barChartLabels"
              :colors="getMainColors()"
              :height="320"
              :horizontal="false"
            />
          </CardContent>
        </Card>
      </div>

      <!-- Popular News Section -->
      <Card>
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2 text-xl font-semibold">
                <NewspaperIcon class="h-5 w-5" />
                Berita Populer
              </CardTitle>
              <CardDescription class="mt-1">
                Berita yang paling banyak dilihat
                <span v-if="popularNews.length > 0" class="ml-1"> ({{ popularNews.length }} berita) </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" as-child>
              <RouterLink to="/app/berita"> Lihat Semua </RouterLink>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <!-- Empty state -->
          <div v-if="popularNews.length === 0" class="p-6 text-center">
            <NewspaperIcon class="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p class="text-muted-foreground">Belum ada berita populer</p>
          </div>

          <!-- List berita populer -->
          <div v-else class="max-h-[500px] divide-y overflow-y-auto">
            <RouterLink
              v-for="news in popularNews"
              :key="news.id"
              :to="`/app/berita/${news.id}`"
              class="hover:bg-muted/50 flex cursor-pointer items-start gap-4 p-6 transition-colors"
            >
              <!-- Thumbnail -->
              <div v-if="news.image" class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <img :src="news.image" :alt="news.title" class="h-full w-full object-cover" />
              </div>
              <div
                v-else
                class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20"
              >
                <NewspaperIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>

              <!-- Content -->
              <div class="flex-1 space-y-2">
                <h3 class="line-clamp-2 leading-tight font-semibold">{{ news.title }}</h3>
                <div class="text-muted-foreground line-clamp-2 text-sm" v-html="news.description"></div>
                <div class="flex items-center justify-between">
                  <p class="text-muted-foreground text-xs">{{ date(news.date) }}</p>
                  <Badge variant="secondary" class="flex items-center gap-1 text-xs">
                    <Eye class="h-3 w-3" />
                    {{ news.views.toLocaleString("id-ID") }} views
                  </Badge>
                </div>
              </div>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
