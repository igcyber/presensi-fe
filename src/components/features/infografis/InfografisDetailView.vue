<script setup lang="ts">
import { ArrowLeft, Calendar, ExternalLink, Image, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Infografis } from "@/lib/api/types/infografis.types";

interface Props {
  infografis: Infografis;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", infografis: Infografis): void;
  (e: "delete", infografis: Infografis): void;
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
  const name = props.infografis.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const statusBadge = computed(() => {
  return props.infografis.status === "1"
    ? { label: "Aktif", variant: "default" as const }
    : { label: "Tidak Aktif", variant: "secondary" as const };
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.infografis);
};

const handleDelete = () => {
  emit("delete", props.infografis);
};

const handleOpenInfografis = () => {
  if (props.infografis.url) {
    window.open(props.infografis.url, "_blank");
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
          {{ infografis.nama }}
        </CardTitle>

        <!-- Meta Information -->
        <div class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ infografis.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-1">
            <Badge :variant="statusBadge.variant">{{ statusBadge.label }}</Badge>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span class="truncate">{{ date(infografis.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :infografis="infografis" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Infografis Image Card -->
    <Card v-if="infografis.foto && infografis.fileUrl">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Image class="h-5 w-5" />
          Gambar Infografis
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Infografis Image -->
        <div class="flex justify-center">
          <div class="relative overflow-hidden rounded-lg border shadow-sm" style="max-width: 100%; width: 100%">
            <img
              :src="infografis.fileUrl"
              :alt="infografis.nama"
              class="h-auto w-full max-w-2xl object-contain"
              style="max-height: 600px"
              loading="lazy"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Infografis Info Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <ExternalLink class="h-5 w-5" />
          Informasi Infografis
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Infografis URL Info -->
        <div v-if="infografis.url" class="bg-muted/50 rounded-lg p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <div class="flex-shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <ExternalLink class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium break-words">{{ infografis.nama }}</p>
                <p class="text-muted-foreground text-sm break-all">{{ infografis.url }}</p>
              </div>
            </div>
            <div class="flex flex-shrink-0">
              <Button @click="handleOpenInfografis" class="w-full gap-2 sm:w-auto">
                <ExternalLink class="h-4 w-4" />
                <span class="hidden sm:inline">Buka Link</span>
                <span class="sm:hidden">Buka</span>
              </Button>
            </div>
          </div>
        </div>

        <!-- No URL Info -->
        <div v-else class="bg-muted/30 rounded-lg p-4 text-center">
          <div class="text-muted-foreground">
            <ExternalLink class="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p class="text-sm">Tidak ada URL yang terkait</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Content Card -->
    <Card v-if="infografis.isi">
      <CardHeader>
        <CardTitle class="text-xl">Isi Infografis</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed" v-html="infografis.isi"></div>
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
              <p class="truncate">
                <span class="font-medium">Dibuat oleh:</span>
                {{ infografis.createdByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(infografis.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="infografis.updatedAt && infografis.updatedAt !== infografis.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ infografis.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(infografis.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
