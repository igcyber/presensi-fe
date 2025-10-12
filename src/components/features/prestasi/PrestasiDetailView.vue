<script setup lang="ts">
import { ArrowLeft, Award, Calendar, Star, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Prestasi } from "@/lib/api/types/prestasi.types";

interface Props {
  prestasi: Prestasi;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", prestasi: Prestasi): void;
  (e: "delete", prestasi: Prestasi): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();

// Computed properties
const creatorInitials = computed(() => {
  const name = props.prestasi.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const tingkatColor = computed(() => {
  const tingkat = props.prestasi.tingkat?.toLowerCase();
  switch (tingkat) {
    case "internasional":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "nasional":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "provinsi":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "regional":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.prestasi);
};

const handleDelete = () => {
  emit("delete", props.prestasi);
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

    <!-- Header Card -->
    <Card>
      <CardHeader class="space-y-4">
        <!-- Title -->
        <CardTitle class="text-2xl leading-tight font-bold lg:text-3xl">
          {{ prestasi.nama }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span>{{ prestasi.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Tahun -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ prestasi.tahun }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(prestasi.createdAt) }}</span>
          </div>
        </div>

        <!-- Tingkat Badge -->
        <div class="flex items-center gap-2">
          <Badge :class="tingkatColor" class="text-xs font-medium">
            <Star class="mr-1 h-3 w-3" />
            {{ prestasi.tingkat }}
          </Badge>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :prestasi="prestasi" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Achievement Info Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Award class="h-5 w-5" />
          Detail Prestasi
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Prestasi Info -->
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-muted-foreground text-sm font-medium">Judul</dt>
              <dd class="mt-1 font-medium">{{ prestasi.judul }}</dd>
            </div>
            <div>
              <dt class="text-muted-foreground text-sm font-medium">Tingkat</dt>
              <dd class="mt-1">
                <Badge :class="tingkatColor" class="text-xs">
                  {{ prestasi.tingkat }}
                </Badge>
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-muted-foreground text-sm font-medium">Nama Prestasi</dt>
              <dd class="mt-1 font-medium">{{ prestasi.nama }}</dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Keterangan</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed" v-html="prestasi.keterangan"></div>
      </CardContent>
    </Card>

    <!-- Footer Information -->
    <Card class="bg-muted/50">
      <CardContent>
        <div class="grid gap-4 text-sm sm:grid-cols-2">
          <!-- Created Info -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Dibuat oleh:</span>
                {{ prestasi.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(prestasi.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="prestasi.updatedAt && prestasi.updatedAt !== prestasi.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ prestasi.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(prestasi.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
