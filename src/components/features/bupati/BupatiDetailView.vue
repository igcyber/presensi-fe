<script setup lang="ts">
import { ArrowLeft, Calendar, Crown, User, Users } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Bupati } from "@/lib/api/types/bupati.types";

interface Props {
  bupati: Bupati;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", bupati: Bupati): void;
  (e: "delete", bupati: Bupati): void;
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
  const name = props.bupati.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const periodeBadgeColor = computed(() => {
  const currentYear = new Date().getFullYear();
  if (props.bupati.tahunAkhir >= currentYear) {
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
});

const periodeStatus = computed(() => {
  const currentYear = new Date().getFullYear();
  if (props.bupati.tahunAkhir >= currentYear) {
    return "Aktif";
  } else {
    return "Selesai";
  }
});

const masaJabatan = computed(() => {
  const durasi = props.bupati.tahunAkhir - props.bupati.tahunAwal;
  return `${durasi} Tahun`;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.bupati);
};

const handleDelete = () => {
  emit("delete", props.bupati);
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
          {{ bupati.namaBupati }}
        </CardTitle>

        <!-- Subtitle -->
        <p class="text-muted-foreground text-lg">Bersama {{ bupati.namaWakil }}</p>

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
              <span>{{ bupati.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Periode -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ bupati.tahunAwal }} - {{ bupati.tahunAkhir }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(bupati.createdAt) }}</span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex items-center gap-2">
          <Badge :class="periodeBadgeColor" class="text-xs font-medium">
            <Crown class="mr-1 h-3 w-3" />
            {{ periodeStatus }}
          </Badge>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :bupati="bupati" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Photo Card -->
    <Card v-if="bupati.foto && bupati.fotoUrl">
      <CardContent class="p-0">
        <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9">
          <img
            :src="bupati.fotoUrl"
            :alt="`${bupati.namaBupati} & ${bupati.namaWakil}`"
            class="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardContent>
    </Card>

    <!-- No Photo Fallback -->
    <Card v-else-if="!bupati.foto">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <Crown class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada foto</p>
        </div>
      </CardContent>
    </Card>

    <!-- Leadership Information Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Crown class="h-5 w-5" />
          Informasi Kepemimpinan
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Leadership Info Grid -->
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Bupati -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Crown class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Bupati</dt>
                <dd class="mt-1 font-medium">{{ bupati.namaBupati }}</dd>
              </div>
            </div>
          </div>

          <!-- Wakil Bupati -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Users class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Wakil Bupati</dt>
                <dd class="mt-1 font-medium">{{ bupati.namaWakil }}</dd>
              </div>
            </div>
          </div>

          <!-- Periode -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                <Calendar class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Periode Jabatan</dt>
                <dd class="mt-1 font-medium">{{ bupati.tahunAwal }} - {{ bupati.tahunAkhir }}</dd>
              </div>
            </div>
          </div>

          <!-- Masa Jabatan -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                <Calendar class="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Masa Jabatan</dt>
                <dd class="mt-1 font-medium">{{ masaJabatan }}</dd>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="bg-muted/50 rounded-lg p-4 sm:col-span-2">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                <Crown class="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Status Kepemimpinan</dt>
                <dd class="mt-1">
                  <Badge :class="periodeBadgeColor" class="text-xs">
                    {{ periodeStatus }}
                  </Badge>
                </dd>
              </div>
            </div>
          </div>
        </div>
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
                {{ bupati.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(bupati.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="bupati.updatedAt && bupati.updatedAt !== bupati.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ bupati.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(bupati.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
