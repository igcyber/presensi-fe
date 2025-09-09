<script setup lang="ts">
import {
  AlertTriangleIcon,
  BarChart3Icon,
  CheckCircleIcon,
  FileTextIcon,
  PlusIcon,
  SettingsIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Data statistik
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
    icon: UserPlusIcon,
    color: "blue",
  },
  {
    id: 2,
    type: "order",
    title: "Pesanan berhasil diproses",
    description: "Pesanan #ORD-2024-001 telah selesai",
    time: "15 menit yang lalu",
    icon: CheckCircleIcon,
    color: "green",
  },
  {
    id: 3,
    type: "warning",
    title: "Peringatan sistem",
    description: "Kapasitas server mencapai 85%",
    time: "1 jam yang lalu",
    icon: AlertTriangleIcon,
    color: "orange",
  },
];

// Data ringkasan hari ini
const todaySummary = [
  { label: "Pengguna Aktif", value: "1,247" },
  { label: "Pesanan Baru", value: "23" },
  { label: "Pendapatan", value: "Rp 2.4M" },
  { label: "Tugas Selesai", value: "18/25" },
];
</script>

<template>
  <div class="bg-background min-h-screen p-4 md:p-6 lg:p-8">
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p class="text-muted-foreground">Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda.</p>
        </div>
        <Button class="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon class="h-4 w-4" />
          Tambah Baru
        </Button>
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
                <Badge :variant="stat.changeType === 'positive' ? 'default' : 'destructive'" class="text-xs">
                  {{ stat.change }} dari bulan lalu
                </Badge>
              </div>
              <div
                :class="[
                  'rounded-full p-3',
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
          <Card class="h-fit">
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Aktivitas terbaru dalam sistem Anda</CardDescription>
                </div>
                <Button variant="ghost" size="sm" class="hover:bg-muted text-sm"> Lihat Semua </Button>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="hover:bg-muted/50 flex items-start space-x-4 rounded-lg border p-4 transition-colors"
              >
                <div
                  :class="[
                    'rounded-full p-2',
                    activity.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/20',
                    activity.color === 'green' && 'bg-green-100 dark:bg-green-900/20',
                    activity.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/20',
                  ]"
                >
                  <component
                    :is="activity.icon"
                    :class="[
                      'h-4 w-4',
                      activity.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                      activity.color === 'green' && 'text-green-600 dark:text-green-400',
                      activity.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                    ]"
                  />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-muted-foreground text-xs">{{ activity.description }}</p>
                  <p class="text-muted-foreground/70 text-xs">{{ activity.time }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Akses fitur yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="w-full justify-start" variant="outline">
                <PlusIcon class="mr-2 h-4 w-4" />
                Tambah Pengguna
              </Button>
              <Button class="w-full justify-start" variant="outline">
                <FileTextIcon class="mr-2 h-4 w-4" />
                Buat Laporan
              </Button>
              <Button class="w-full justify-start" variant="outline">
                <SettingsIcon class="mr-2 h-4 w-4" />
                Pengaturan
              </Button>
            </CardContent>
          </Card>

          <!-- Today's Summary -->
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-for="item in todaySummary" :key="item.label" class="flex items-center justify-between py-2">
                <span class="text-muted-foreground text-sm">{{ item.label }}</span>
                <span class="font-semibold">{{ item.value }}</span>
              </div>
            </CardContent>
          </Card>

          <!-- Progress Card -->
          <Card>
            <CardHeader>
              <CardTitle>Progress Bulanan</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Target Penjualan</span>
                  <span class="font-medium">72%</span>
                </div>
                <div class="bg-muted h-2 rounded-full">
                  <div class="bg-primary h-2 w-[72%] rounded-full"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Kepuasan Pelanggan</span>
                  <span class="font-medium">89%</span>
                </div>
                <div class="bg-muted h-2 rounded-full">
                  <div class="h-2 w-[89%] rounded-full bg-green-500"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Efisiensi Operasional</span>
                  <span class="font-medium">94%</span>
                </div>
                <div class="bg-muted h-2 rounded-full">
                  <div class="h-2 w-[94%] rounded-full bg-blue-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
