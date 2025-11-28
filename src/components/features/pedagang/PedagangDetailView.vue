<script setup lang="ts">
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  FileText,
  Hash,
  MapPin,
  Plus,
  Power,
  Store,
  Trash2,
  User,
} from "lucide-vue-next";
import { computed } from "vue";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { PedagangDetail, PedagangKios } from "@/lib/api/types/pedagang.types";

interface Props {
  pedagang: PedagangDetail;
  showBackButton?: boolean;
  pedagangKios?: PedagangKios[];
  isLoadingKios?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", pedagang: PedagangDetail): void;
  (e: "delete", pedagang: PedagangDetail): void;
  (e: "add-kios"): void;
  (e: "toggle-active", pedagangKios: PedagangKios): void;
  (e: "delete-kios", pedagangKios: PedagangKios): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const { date } = useFormatters();

// Computed properties
const formattedTanggalLahir = computed(() => {
  if (!props.pedagang.tanggalLahir || typeof props.pedagang.tanggalLahir !== "string") {
    return "-";
  }
  return date(props.pedagang.tanggalLahir);
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.pedagang);
};

const handleDelete = () => {
  emit("delete", props.pedagang);
};
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-6 p-4">
    <!-- Back Button (Optional) -->
    <div v-if="showBackButton" class="flex items-center">
      <Button variant="ghost" size="sm" @click="handleBack" class="gap-2 px-0">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div>

    <!-- Main Content -->
    <Card>
      <CardHeader>
        <div class="flex items-start gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User class="h-8 w-8 text-blue-600" />
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">{{ pedagang.nama }}</CardTitle>
            <CardDescription>Pedagang ID: {{ pedagang.id }}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :pedagang="pedagang" :onEdit="handleEdit" :onDelete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Dasar</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <User class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Nama</p>
                  <p class="font-medium">{{ pedagang.nama }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Hash class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">NIK</p>
                  <p class="font-medium">{{ pedagang.nik }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <FileText class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">No. KK</p>
                  <p class="font-medium">{{ pedagang.noKk }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Store class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Jenis Usaha</p>
                  <p v-if="pedagang.jenisUsaha" class="font-medium">
                    <Badge
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :style="{
                        backgroundColor: (pedagang.jenisUsaha.warna || '#6B7280') + '20',
                        color: pedagang.jenisUsaha.warna || '#6B7280',
                        border: `1px solid ${(pedagang.jenisUsaha.warna || '#6B7280')}40`,
                      }"
                    >
                      {{ pedagang.jenisUsaha.nama }}
                    </Badge>
                  </p>
                  <p v-else class="font-medium text-muted-foreground">-</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Pribadi</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <MapPin class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Tempat Lahir</p>
                  <p class="font-medium">{{ pedagang.tempatLahir }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Calendar class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                  <p class="font-medium">{{ formattedTanggalLahir }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-lg border p-3">
                <MapPin class="mt-1 h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Alamat</p>
                  <p class="font-medium">{{ pedagang.alamat }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-semibold">Informasi Sistem</h3>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div class="flex items-center gap-3 rounded-lg border p-3">
              <Calendar class="h-4 w-4 text-gray-400" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500">Dibuat</p>
                <p class="font-medium">{{ pedagang.createdAt ? date(pedagang.createdAt) : "-" }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-lg border p-3">
              <CalendarClock class="h-4 w-4 text-gray-400" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                <p class="font-medium">{{ pedagang.updatedAt ? date(pedagang.updatedAt) : "-" }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Kios Section -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Kios yang Ditetapkan</CardTitle>
            <CardDescription>Daftar kios yang ditetapkan untuk pedagang ini</CardDescription>
          </div>
          <Button size="sm" @click="$emit('add-kios')" class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Tambah Kios
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="isLoadingKios" class="flex items-center justify-center py-8">
          <div class="flex items-center gap-2">
            <div class="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
            <span class="text-muted-foreground">Memuat data kios...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!pedagangKios || pedagangKios.length === 0"
          class="flex flex-col items-center justify-center py-8 text-center"
        >
          <Store class="mb-4 h-12 w-12 text-gray-400" />
          <p class="text-muted-foreground mb-2">Belum ada kios yang ditetapkan</p>
          <p class="text-muted-foreground text-sm">Klik tombol "Tambah Kios" untuk menetapkan kios ke pedagang ini</p>
        </div>

        <!-- Kios List -->
        <div v-else class="space-y-3">
          <div
            v-for="pedagangKiosItem in pedagangKios"
            :key="pedagangKiosItem.id"
            class="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div class="flex flex-1 items-center gap-4">
              <div class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Store class="text-primary h-5 w-5" />
              </div>
              <div class="flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <p class="font-semibold">{{ pedagangKiosItem.kios?.kode || "Kios #" + pedagangKiosItem.kiosId }}</p>
                  <Badge
                    :class="
                      pedagangKiosItem.isActive
                        ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                    "
                    variant="outline"
                  >
                    {{ pedagangKiosItem.isActive ? "Aktif" : "Tidak Aktif" }}
                  </Badge>
                </div>
                <div class="text-muted-foreground text-sm">
                  <span v-if="pedagangKiosItem.kios?.jenisUsaha">
                    {{ pedagangKiosItem.kios.jenisUsaha.nama }}
                  </span>
                  <span v-if="pedagangKiosItem.kios?.pasar">
                    <span v-if="pedagangKiosItem.kios?.jenisUsaha"> - </span>
                    {{ pedagangKiosItem.kios.pasar.nama }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="$emit('toggle-active', pedagangKiosItem)"
                class="flex items-center gap-2"
              >
                <Power class="h-4 w-4" />
                {{ pedagangKiosItem.isActive ? "Nonaktifkan" : "Aktifkan" }}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                @click="$emit('delete-kios', pedagangKiosItem)"
                class="flex items-center gap-2"
              >
                <Trash2 class="h-4 w-4" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
