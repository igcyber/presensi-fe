<script setup lang="ts">
import {
  ActivityIcon,
  BarChart3Icon,
  DownloadIcon,
  FileTextIcon,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Data statistik contoh
const stats = [
  {
    title: "Total Pengguna",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: UsersIcon,
    color: "blue",
  },
  {
    title: "Pendapatan",
    value: "Rp 45.2M",
    change: "+8%",
    changeType: "positive",
    icon: TrendingUpIcon,
    color: "green",
  },
  {
    title: "Pesanan Aktif",
    value: "1,234",
    change: "-3%",
    changeType: "negative",
    icon: ShoppingCartIcon,
    color: "orange",
  },
  {
    title: "Tingkat Konversi",
    value: "3.24%",
    change: "+0.5%",
    changeType: "positive",
    icon: BarChart3Icon,
    color: "purple",
  },
];

// Data aktivitas terbaru
const recentActivities = [
  {
    id: 1,
    type: "user",
    title: "Pengguna baru mendaftar",
    description: "Ahmad Rizki bergabung dengan platform",
    time: "2 menit yang lalu",
    icon: UsersIcon,
    color: "blue",
  },
  {
    id: 2,
    type: "order",
    title: "Pesanan berhasil diproses",
    description: "Pesanan #ORD-2024-001 telah selesai",
    time: "15 menit yang lalu",
    icon: ShoppingCartIcon,
    color: "green",
  },
  {
    id: 3,
    type: "warning",
    title: "Peringatan sistem",
    description: "Kapasitas server mencapai 85%",
    time: "1 jam yang lalu",
    icon: ActivityIcon,
    color: "orange",
  },
  {
    id: 4,
    type: "update",
    title: "Pembaruan sistem",
    description: "Fitur baru telah dirilis v2.1.0",
    time: "3 jam yang lalu",
    icon: RefreshCwIcon,
    color: "purple",
  },
];

// Data ringkasan hari ini
const todaySummary = [
  { label: "Pengguna Aktif", value: "1,247", trend: "up", change: "+5%" },
  { label: "Pesanan Baru", value: "23", trend: "up", change: "+12%" },
  { label: "Pendapatan", value: "Rp 2.4M", trend: "up", change: "+8%" },
  { label: "Tugas Selesai", value: "18/25", trend: "neutral", change: "72%" },
];
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Dashboard Data</h1>
          <p class="text-muted-foreground">Pantau performa dan aktivitas sistem secara real-time</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" class="flex items-center gap-2">
            <DownloadIcon class="h-4 w-4" />
            Ekspor Data
          </Button>
          <Button class="flex items-center gap-2">
            <PlusIcon class="h-4 w-4" />
            Tambah Data Baru
          </Button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <div class="flex items-center gap-1">
                  <Badge :variant="stat.changeType === 'positive' ? 'default' : 'destructive'" class="text-xs">
                    {{ stat.change }}
                  </Badge>
                  <span class="text-muted-foreground text-xs">dari bulan lalu</span>
                </div>
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
        <!-- Recent Activities -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-xl font-semibold">Aktivitas Terbaru</CardTitle>
                  <CardDescription class="mt-1"> Pantau aktivitas sistem dalam waktu nyata </CardDescription>
                </div>
                <Button variant="ghost" size="sm"> Lihat Semua </Button>
              </div>
            </CardHeader>
            <CardContent class="p-0">
              <div class="divide-y">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="hover:bg-muted/50 flex items-start gap-4 p-6 transition-colors"
                >
                  <div
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
                  <div class="flex-1 space-y-1">
                    <p class="font-medium">{{ activity.title }}</p>
                    <p class="text-muted-foreground text-sm">{{ activity.description }}</p>
                    <p class="text-muted-foreground text-xs">{{ activity.time }}</p>
                  </div>
                </div>
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
                <FileTextIcon class="mr-3 h-4 w-4" />
                Buat Laporan
              </Button>
              <Button class="w-full justify-start" variant="ghost">
                <BarChart3Icon class="mr-3 h-4 w-4" />
                Analisis Data
              </Button>
              <Button class="w-full justify-start" variant="ghost">
                <SettingsIcon class="mr-3 h-4 w-4" />
                Pengaturan
              </Button>
            </CardContent>
          </Card>

          <!-- Today's Summary -->
          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg font-semibold">Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-for="item in todaySummary" :key="item.label" class="flex items-center justify-between py-2">
                <span class="text-muted-foreground text-sm font-medium">{{ item.label }}</span>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ item.value }}</span>
                  <div
                    v-if="item.trend === 'up'"
                    class="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/20"
                  >
                    <TrendingUpIcon class="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span class="text-xs text-green-600 dark:text-green-400">{{ item.change }}</span>
                  </div>
                  <div
                    v-else-if="item.trend === 'down'"
                    class="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 dark:bg-red-900/20"
                  >
                    <TrendingDownIcon class="h-3 w-3 text-red-600 dark:text-red-400" />
                    <span class="text-xs text-red-600 dark:text-red-400">{{ item.change }}</span>
                  </div>
                  <div v-else class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                    <span class="text-muted-foreground text-xs">{{ item.change }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Performance Indicator -->
          <Card class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            <CardContent class="p-6">
              <div class="space-y-4 text-center">
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50"
                >
                  <BarChart3Icon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="space-y-2">
                  <h3 class="font-semibold">Performa Sistem</h3>
                  <p class="text-muted-foreground text-sm">Sistem berjalan optimal</p>
                </div>
                <div class="space-y-2">
                  <div class="h-2 w-full rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <div
                      class="h-2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400"
                      style="width: 85%"
                    ></div>
                  </div>
                  <p class="text-muted-foreground text-xs">85% kapasitas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
