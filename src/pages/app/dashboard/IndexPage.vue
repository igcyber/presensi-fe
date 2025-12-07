<script setup lang="ts">
import {
  BarChart3Icon,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCwIcon,
  Users,
  XCircle,
} from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoughnutChart } from "@/components/ui/charts";
import { Bar } from "vue-chartjs";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { getDashboardChart, getDashboardDaily, getDashboardSummary } from "@/lib/api/services";
import type { DashboardChartData, DashboardDailyData, DashboardSummaryData } from "@/lib/api/types/dashboard.types";

const chartType = ref<"daily" | "weekly" | "monthly">("daily");

const {
  data: summaryResponse,
  isLoading: isLoadingSummary,
  refresh: refreshSummary,
} = useFetch<ApiResponse<DashboardSummaryData>, ApiResponse<DashboardSummaryData>>(() => getDashboardSummary(), {
  immediate: true,
});

const {
  data: chartResponse,
  isLoading: isLoadingChart,
  refresh: refreshChart,
} = useFetch<ApiResponse<DashboardChartData>, ApiResponse<DashboardChartData>>(
  () => getDashboardChart(chartType.value),
  {
    immediate: true,
  },
);

const {
  data: dailyResponse,
  isLoading: isLoadingDaily,
  refresh: refreshDaily,
} = useFetch<ApiResponse<DashboardDailyData>, ApiResponse<DashboardDailyData>>(() => getDashboardDaily(), {
  immediate: true,
});

const summaryData = computed(() => {
  if (!summaryResponse.value || !summaryResponse.value.data) {
    return {
      overview: {
        total_pegawai: 0,
        total_absen_masuk: 0,
        total_absen_pulang: 0,
        unique_pegawai_hadir: 0,
        unique_pegawai_tidak_hadir: 0,
      },
      daily_breakdown: {},
    };
  }
  return summaryResponse.value.data;
});

const chartData = computed(() => {
  if (!chartResponse.value || !chartResponse.value.data) {
    return {
      chart_data: {},
      type: "daily" as const,
    };
  }
  return chartResponse.value.data;
});

const dailyData = computed(() => {
  if (!dailyResponse.value || !dailyResponse.value.data) {
    return {
      total_pegawai: 0,
      pegawai_hadir: 0,
      pegawai_tidak_hadir: 0,
      total_absen_masuk: 0,
      total_absen_pulang: 0,
    };
  }
  return dailyResponse.value.data;
});

const attendanceLabels = computed(() => {
  const total = dailyData.value.total_pegawai;
  const hadir = dailyData.value.pegawai_hadir;
  const tidakHadir = dailyData.value.pegawai_tidak_hadir;

  if (total === 0) {
    return ["Pegawai Hadir", "Pegawai Tidak Hadir"];
  }

  const persentaseHadir = Math.round((hadir / total) * 100);
  const persentaseTidakHadir = Math.round((tidakHadir / total) * 100);

  return [
    `Pegawai Hadir: ${hadir.toLocaleString("id-ID")} (${persentaseHadir}%)`,
    `Pegawai Tidak Hadir: ${tidakHadir.toLocaleString("id-ID")} (${persentaseTidakHadir}%)`,
  ];
});

const isLoading = computed(() => isLoadingSummary.value || isLoadingChart.value || isLoadingDaily.value);

const stats = computed(() => [
  {
    title: "Total Pegawai",
    value: summaryData.value.overview.total_pegawai.toLocaleString("id-ID"),
    icon: Users,
    color: "blue",
  },
  {
    title: "Pegawai Hadir",
    value: summaryData.value.overview.unique_pegawai_hadir.toLocaleString("id-ID"),
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "Pegawai Tidak Hadir",
    value: summaryData.value.overview.unique_pegawai_tidak_hadir.toLocaleString("id-ID"),
    icon: XCircle,
    color: "red",
  },
  {
    title: "Total Absen Masuk",
    value: summaryData.value.overview.total_absen_masuk.toLocaleString("id-ID"),
    icon: Clock,
    color: "orange",
  },
  {
    title: "Total Absen Pulang",
    value: summaryData.value.overview.total_absen_pulang.toLocaleString("id-ID"),
    icon: Calendar,
    color: "purple",
  },
]);

const totalAbsen = computed(() => {
  return (
    summaryData.value.overview.total_absen_masuk + summaryData.value.overview.total_absen_pulang
  );
});

const dailyBreakdown = computed(() => {
  const breakdown = summaryData.value.daily_breakdown;
  return Object.entries(breakdown)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
});

const chartDataArray = computed(() => {
  const data = chartData.value.chart_data;
  return Object.values(data);
});

const chartLabels = computed(() => {
  return chartDataArray.value.map((item) => item.label);
});

const chartMasukData = computed(() => {
  return chartDataArray.value.map((item) => item.masuk);
});

const chartPulangData = computed(() => {
  return chartDataArray.value.map((item) => item.pulang);
});

const groupedChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: "Absen Masuk",
      data: chartMasukData.value,
      backgroundColor: "#3b82f6",
      borderRadius: 8,
      borderSkipped: false,
    },
    {
      label: "Absen Pulang",
      data: chartPulangData.value,
      backgroundColor: "#22c55e",
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}));

const groupedChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        padding: 8,
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 10,
      titleFont: {
        size: 12,
        family: "'Inter', sans-serif",
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif",
      },
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      displayColors: true,
      callbacks: {
        label: function (context: any) {
          return `${context.dataset.label}: ${context.parsed.y.toLocaleString("id-ID")}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 10,
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 10,
          family: "'Inter', sans-serif",
        },
        callback: function (value: any) {
          return value.toLocaleString("id-ID");
        },
      },
      beginAtZero: true,
    },
  },
  animation: {
    duration: 750,
    easing: "easeInOutQuart" as const,
  },
}));

const hasData = computed(() => {
  return (
    summaryData.value.overview.total_pegawai > 0 ||
    totalAbsen.value > 0 ||
    chartDataArray.value.length > 0 ||
    dailyBreakdown.value.length > 0
  );
});

const handleRefresh = () => {
  refreshSummary();
  refreshChart();
  refreshDaily();
};

const handleChartTypeChange = (type: "daily" | "weekly" | "monthly") => {
  chartType.value = type;
  refreshChart();
};
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
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
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p class="text-muted-foreground">Ringkasan data presensi pegawai</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" class="flex items-center gap-2" @click="handleRefresh">
            <RefreshCwIcon class="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

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
                  stat.color === 'red' && 'bg-red-100 dark:bg-red-900/20',
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
                    stat.color === 'red' && 'text-red-600 dark:text-red-400',
                    stat.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                    stat.color === 'purple' && 'text-purple-600 dark:text-purple-400',
                  ]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-if="!hasData" class="flex min-h-[400px] items-center justify-center">
        <div class="text-center">
          <BarChart3Icon class="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 class="mb-2 text-lg font-semibold">Belum Ada Data</h3>
          <p class="text-muted-foreground">Data presensi akan muncul setelah ada aktivitas</p>
        </div>
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2">
                  <BarChart3Icon class="h-5 w-5" />
                  Grafik Presensi
                </CardTitle>
                <CardDescription>Visualisasi presensi masuk dan pulang</CardDescription>
              </div>
              <div class="flex gap-2">
                <Button
                  :variant="chartType === 'daily' ? 'default' : 'outline'"
                  size="sm"
                  @click="handleChartTypeChange('daily')"
                >
                  Harian
                </Button>
                <Button
                  :variant="chartType === 'weekly' ? 'default' : 'outline'"
                  size="sm"
                  @click="handleChartTypeChange('weekly')"
                >
                  Mingguan
                </Button>
                <Button
                  :variant="chartType === 'monthly' ? 'default' : 'outline'"
                  size="sm"
                  @click="handleChartTypeChange('monthly')"
                >
                  Bulanan
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent class="pt-6">
            <div v-if="chartLabels.length === 0" class="flex h-[280px] items-center justify-center">
              <p class="text-muted-foreground">Belum ada data chart</p>
            </div>
            <div v-else :style="{ height: '280px' }">
              <Bar :data="groupedChartData" :options="groupedChartOptions" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Calendar class="h-5 w-5" />
              Data Presensi Harian
            </CardTitle>
            <CardDescription>Distribusi pegawai hadir dan tidak hadir hari ini</CardDescription>
          </CardHeader>
          <CardContent class="pt-6">
            <div v-if="dailyData.total_pegawai === 0" class="flex h-[280px] items-center justify-center">
              <p class="text-muted-foreground">Belum ada data</p>
            </div>
            <DoughnutChart
              v-else
              :data="[dailyData.pegawai_hadir, dailyData.pegawai_tidak_hadir]"
              :labels="attendanceLabels"
              :colors="['#22c55e', '#ef4444']"
              :height="280"
              :show-legend="true"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-xl font-semibold">Rincian Harian</CardTitle>
              <CardDescription class="mt-1">
                Data presensi harian terbaru
                <span v-if="dailyBreakdown.length > 0" class="ml-1">
                  ({{ dailyBreakdown.length }} hari)
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div v-if="dailyBreakdown.length === 0" class="p-6 text-center">
            <p class="text-muted-foreground">Belum ada data presensi</p>
          </div>

          <div v-else class="max-h-[600px] divide-y overflow-y-auto">
            <div
              v-for="item in dailyBreakdown"
              :key="item.date"
              class="hover:bg-muted/50 flex cursor-pointer items-start gap-4 p-6 transition-colors"
            >
              <div
                class="rounded-full p-2 bg-blue-100 dark:bg-blue-900/20"
              >
                <Calendar
                  class="h-4 w-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div class="flex-1 space-y-2">
                <p class="font-medium">{{ new Date(item.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) }}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-muted-foreground">Pegawai Hadir</p>
                    <p class="font-semibold text-green-600 dark:text-green-400">{{ item.pegawaiHadir }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Pegawai Tidak Hadir</p>
                    <p class="font-semibold text-red-600 dark:text-red-400">{{ item.pegawaiTidakHadir }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Total Absen Masuk</p>
                    <p class="font-semibold">{{ item.totalAbsenMasuk }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Total Absen Pulang</p>
                    <p class="font-semibold">{{ item.totalAbsenPulang }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
