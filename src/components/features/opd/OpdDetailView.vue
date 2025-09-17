<script setup lang="ts">
import { ArrowLeft, Building, Calendar, ExternalLink, Globe, MapPin, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Opd } from "@/lib/api/types/opd.types";

interface Props {
  opd: Opd;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", opd: Opd): void;
  (e: "delete", opd: Opd): void;
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
  const name = props.opd.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.opd);
};

const handleDelete = () => {
  emit("delete", props.opd);
};

const handleOpenMaps = () => {
  if (props.opd.maps) {
    window.open(props.opd.maps, "_blank");
  }
};

const handleOpenWebsite = () => {
  if (props.opd.website) {
    window.open(props.opd.website, "_blank");
  }
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
          {{ opd.nama }}
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
              <span>{{ opd.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(opd.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :opd="opd" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Photo Card -->
    <Card v-if="opd.foto && opd.fotoUrl">
      <CardContent class="p-0">
        <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9">
          <img
            :src="opd.fotoUrl"
            :alt="opd.nama"
            class="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardContent>
    </Card>

    <!-- No Photo Fallback -->
    <Card v-else-if="!opd.foto">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <Building class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada foto</p>
        </div>
      </CardContent>
    </Card>

    <!-- Organization Information Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Building class="h-5 w-5" />
          Informasi Organisasi
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Organization Info Grid -->
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Alamat -->
          <div class="bg-muted/50 rounded-lg p-4 sm:col-span-2">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <MapPin class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Alamat</dt>
                <dd class="mt-1 text-sm leading-relaxed">{{ opd.alamat }}</dd>
                <Button v-if="opd.maps" variant="outline" size="sm" class="mt-2 gap-2" @click="handleOpenMaps">
                  <ExternalLink class="h-4 w-4" />
                  Lihat di Maps
                </Button>
              </div>
            </div>
          </div>

          <!-- Website -->
          <div v-if="opd.website" class="bg-muted/50 rounded-lg p-4 sm:col-span-2">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Globe class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Website</dt>
                <dd class="mt-1 text-sm break-all">{{ opd.website }}</dd>
                <Button variant="outline" size="sm" class="mt-2 gap-2" @click="handleOpenWebsite">
                  <ExternalLink class="h-4 w-4" />
                  Kunjungi Website
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Description Card -->
    <Card v-if="opd.keterangan">
      <CardHeader>
        <CardTitle class="text-xl">Keterangan</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed">{{ opd.keterangan }}</div>
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
                {{ opd.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(opd.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="opd.updatedAt && opd.updatedAt !== opd.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ opd.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(opd.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
