<script setup lang="ts">
import { ArrowLeft, Building, Calendar, MapPin, User, Zap } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Layanan } from "@/lib/api/types/layanan.types";

interface Props {
  layanan: Layanan;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", layanan: Layanan): void;
  (e: "delete", layanan: Layanan): void;
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
  const name = props.layanan.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const jenisColor = computed(() => {
  const jenis = props.layanan.jenis?.toLowerCase();
  if (jenis?.includes("digital") || jenis?.includes("online")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
  } else if (jenis?.includes("konsultasi")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  } else if (jenis?.includes("publik")) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.layanan);
};

const handleDelete = () => {
  emit("delete", props.layanan);
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
          {{ layanan.nama }}
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
              <span>{{ layanan.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- OPD -->
          <div class="flex items-center gap-1">
            <Building class="h-4 w-4" />
            <span>{{ layanan.opd.nama }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(layanan.createdAt) }}</span>
          </div>
        </div>

        <!-- Jenis Badge -->
        <div class="flex items-center gap-2">
          <Badge :class="jenisColor" class="text-xs font-medium">
            <Zap class="mr-1 h-3 w-3" />
            {{ layanan.jenis }}
          </Badge>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :layanan="layanan" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Logo Card -->
    <Card v-if="layanan.logo && layanan.logoUrl">
      <CardContent class="p-0">
        <div class="bg-muted/20 relative overflow-hidden rounded-lg p-8">
          <div class="flex justify-center">
            <img
              :src="layanan.logoUrl"
              :alt="layanan.nama"
              class="h-32 w-32 object-contain transition-transform hover:scale-105"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- No Logo Fallback -->
    <Card v-else-if="!layanan.logo">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <Zap class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada logo</p>
        </div>
      </CardContent>
    </Card>

    <!-- Service Information Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Zap class="h-5 w-5" />
          Informasi Layanan
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Service Info Grid -->
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Jenis Layanan -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Zap class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Jenis Layanan</dt>
                <dd class="mt-1">
                  <Badge :class="jenisColor" class="text-xs">
                    {{ layanan.jenis }}
                  </Badge>
                </dd>
              </div>
            </div>
          </div>

          <!-- OPD -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Building class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Organisasi Perangkat Daerah</dt>
                <dd class="mt-1 font-medium">{{ layanan.opd.nama }}</dd>
              </div>
            </div>
          </div>

          <!-- Alamat -->
          <div class="bg-muted/50 rounded-lg p-4 sm:col-span-2">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                <MapPin class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Alamat Layanan</dt>
                <dd class="mt-1 text-sm leading-relaxed">{{ layanan.alamat }}</dd>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Description Card -->
    <Card v-if="layanan.keterangan">
      <CardHeader>
        <CardTitle class="text-xl">Keterangan Layanan</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed">{{ layanan.keterangan }}</div>
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
                {{ layanan.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(layanan.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="layanan.updatedAt && layanan.updatedAt !== layanan.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ layanan.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(layanan.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
