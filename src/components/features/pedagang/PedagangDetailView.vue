<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft, Calendar, CalendarClock, MapPin, User, Hash, FileText } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { PedagangDetail } from "@/lib/api/types/pedagang.types";

interface Props {
  pedagang: PedagangDetail;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", pedagang: PedagangDetail): void;
  (e: "delete", pedagang: PedagangDetail): void;
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
                <MapPin class="h-4 w-4 text-gray-400 mt-1" />
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
  </div>
</template>

