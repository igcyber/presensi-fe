<script setup lang="ts">
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Settings, User } from "lucide-vue-next";
import { computed } from "vue";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Pengaduan } from "@/lib/api/types/pengaduan.types";

import TindakLanjutList from "./TindakLanjutList.vue";

interface Props {
  pengaduan: Pengaduan;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", pengaduan: Pengaduan): void;
  (e: "refresh"): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();

// Computed properties
const statusLabel = computed(() => {
  return props.pengaduan.status === "diterima" ? "Diterima" : "Belum";
});

const statusVariant = computed(() => {
  return props.pengaduan.status === "diterima" ? "default" : "secondary";
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.pengaduan);
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
          Detail Pengaduan #{{ pengaduan.id }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Status -->
          <div class="flex items-center gap-2">
            <Badge :variant="statusVariant" class="text-xs">
              {{ statusLabel }}
            </Badge>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(pengaduan.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :pengaduan="pengaduan" :on-edit="handleEdit">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit">
              <Settings class="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Pengadu Information Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <User class="h-5 w-5" />
          Informasi Pengadu
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="text-muted-foreground text-sm font-medium">Nama Lengkap</label>
            <p class="text-sm">{{ pengaduan.nama }}</p>
          </div>
          <div>
            <label class="text-muted-foreground text-sm font-medium">NIK</label>
            <p class="font-mono text-sm">{{ pengaduan.nik }}</p>
          </div>
          <div>
            <label class="text-muted-foreground text-sm font-medium">No. HP</label>
            <p class="flex items-center gap-1 text-sm">
              <Phone class="h-4 w-4" />
              {{ pengaduan.noHp }}
            </p>
          </div>
          <div>
            <label class="text-muted-foreground text-sm font-medium">Email</label>
            <p class="flex items-center gap-1 text-sm">
              <Mail class="h-4 w-4" />
              {{ pengaduan.email }}
            </p>
          </div>
        </div>
        <div>
          <label class="text-muted-foreground text-sm font-medium">Alamat</label>
          <p class="flex items-start gap-1 text-sm">
            <MapPin class="mt-0.5 h-4 w-4 flex-shrink-0" />
            {{ pengaduan.alamat }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Aduan Details Card -->
    <Card>
      <CardHeader>
        <CardTitle>Aduan</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <div>
          <label class="text-muted-foreground text-sm font-medium">Jenis Aduan</label>
          <p class="text-sm font-medium">{{ pengaduan.aduan }}</p>
        </div>
        <Separator />
        <div>
          <label class="text-muted-foreground text-sm font-medium">Deskripsi</label>
          <p class="text-sm whitespace-pre-wrap">{{ pengaduan.deskripsi }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Status & Kategori Card -->
    <Card v-if="pengaduan.kategoriAduan || pengaduan.keterangan">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Settings class="h-5 w-5" />
          Status & Kategori
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <div v-if="pengaduan.kategoriAduan">
          <label class="text-muted-foreground text-sm font-medium">Kategori</label>
          <p class="text-sm">{{ pengaduan.kategoriAduan }}</p>
        </div>

        <div v-if="pengaduan.keterangan">
          <label class="text-muted-foreground text-sm font-medium">Keterangan</label>
          <p class="text-sm whitespace-pre-wrap">{{ pengaduan.keterangan }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Tindak Lanjut Section -->
    <TindakLanjutList :pengaduan="pengaduan" :loading="loading" @refresh="$emit('refresh')" />

    <!-- Footer Information -->
    <Card class="bg-muted/50">
      <CardContent>
        <div class="grid gap-4 text-sm sm:grid-cols-2">
          <!-- Created Info -->
          <div class="space-y-1">
            <p class="text-foreground font-medium">Informasi Pembuatan</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Dibuat:</span>
                {{ date(pengaduan.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="pengaduan.updatedAt && pengaduan.updatedAt !== pengaduan.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Terakhir diupdate:</span>
                {{ date(pengaduan.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
