<script setup lang="ts">
import { CameraIcon, IdCardIcon, KeyIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-vue-next";
import { onMounted } from "vue";
import { toast } from "vue-sonner";

import ChangePasswordDialog from "@/components/dialogs/ChangePasswordDialog.vue";
import UpdateProfileForm from "@/components/features/profile/UpdateProfileForm.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables";
import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import { type ApiResponse } from "@/lib/api/core";
import { getCurrentUser } from "@/lib/api/services/auth";
import { type UserAuth } from "@/lib/api/types/auth.types";

const { data, isLoading, fetchData, isError, error } = useFetch<ApiResponse<UserAuth>, UserAuth>(getCurrentUser, {
  immediate: false,
  extractData: (response) => response.data,
});

const { date } = useFormatters();

// State untuk modal/form

const dialog = useDialog<UserAuth>();

onMounted(() => {
  fetchData();
});

const handleProfileUpdateSuccess = () => {
  fetchData();

  toast.success("Profil berhasil diperbarui");
};

const handlePasswordChangeSuccess = () => {
  dialog.closeDialog();
};

// Statistik aktivitas pengguna
// const activityStats = [
//   {
//     title: "Proyek Selesai",
//     value: "24",
//     change: "+3 bulan ini",
//     icon: UserIcon,
//     color: "blue",
//   },
//   {
//     title: "Tugas Aktif",
//     value: "8",
//     change: "Dalam progress",
//     icon: SettingsIcon,
//     color: "orange",
//   },
//   {
//     title: "Kolaborasi",
//     value: "156",
//     change: "+12 minggu ini",
//     icon: UserIcon,
//     color: "green",
//   },
//   {
//     title: "Pencapaian",
//     value: "92%",
//     change: "Tingkat penyelesaian",
//     icon: ShieldIcon,
//     color: "purple",
//   },
// ];
</script>

<template>
  <div class="bg-background p-4 md:p-6 lg:p-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div class="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <div class="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
          <div class="h-10 w-40 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <Card class="overflow-hidden">
        <div class="h-32 animate-pulse bg-gray-200 sm:h-40"></div>
        <CardContent class="relative p-6">
          <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div class="relative -mt-16 sm:-mt-20">
              <div class="h-24 w-24 animate-pulse rounded-full bg-gray-200 sm:h-32 sm:w-32"></div>
            </div>
            <div class="flex-1 space-y-2 text-center sm:text-left">
              <div class="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
              <div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div class="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="i in 4" :key="i">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <div class="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div class="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                <div class="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div class="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError">
      <Card class="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
        <CardContent class="p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <ShieldIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Terjadi Kesalahan</h3>
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ error?.message || "Gagal memuat data profil. Silakan coba lagi." }}
              </p>
            </div>
            <Button
              @click="fetchData"
              variant="outline"
              class="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight">Profil Saya</h1>
          <p class="text-muted-foreground">Kelola informasi pribadi dan pengaturan akun Anda</p>
        </div>
      </div>

      <!-- Profile Overview -->
      <Card class="overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-blue-500 to-purple-600 sm:h-40"></div>
        <CardContent class="relative p-6">
          <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div class="relative -mt-16 sm:-mt-20">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                :alt="data?.fullName"
                class="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32 dark:border-gray-800"
              />
              <Button size="sm" class="absolute right-0 bottom-0 h-8 w-8 rounded-full p-0 shadow-lg">
                <CameraIcon class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex-1 space-y-2 text-center sm:text-left">
              <div class="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                <h2 class="text-2xl font-bold">{{ data?.fullName }}</h2>
                <Badge variant="default" class="text-xs"> Aktif </Badge>
              </div>
              <p class="text-muted-foreground">My Bio</p>
              <div class="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:gap-4">
                <div class="flex items-center gap-1">
                  <MailIcon class="h-4 w-4" />
                  {{ data?.email }}
                </div>
                <div class="flex items-center gap-1">
                  <IdCardIcon class="h-4 w-4" />
                  {{ data?.nip }}
                </div>
              </div>
              <div class="flex items-center gap-1">
                <UserIcon class="h-4 w-4" />
                <p class="text-muted-foreground text-sm">Bergabung sejak {{ date(data?.createdAt) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Statistics Cards -->
      <!--
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="stat in activityStats"
          :key="stat.title"
          class="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <p class="text-muted-foreground text-sm font-medium">{{ stat.title }}</p>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
                <p class="text-muted-foreground text-xs">{{ stat.change }}</p>
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
      -->

      <!-- Main Content Grid -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Profile Information Form -->
        <div class="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Perbarui informasi profil dan kontak Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm :user-data="data ?? undefined" :on-success="handleProfileUpdateSuccess" />
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Pengaturan dan fitur yang sering digunakan</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="w-full justify-start" variant="outline" @click="dialog.openCreate()">
                <KeyIcon class="mr-2 h-4 w-4" />
                Ubah Password
              </Button>
              <!--
              <Button class="w-full justify-start" variant="outline">
                <ShieldIcon class="mr-2 h-4 w-4" />
                Keamanan Akun
              </Button>
              -->
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <ChangePasswordDialog v-model:open="dialog.state.value.open" @success="handlePasswordChangeSuccess" />
  </div>
</template>
