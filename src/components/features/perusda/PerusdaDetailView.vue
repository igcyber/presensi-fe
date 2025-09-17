<script setup lang="ts">
import { ArrowLeft, Building, Calendar, ExternalLink, Mail, MapPin, Phone, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Perusda } from "@/lib/api/types/perusda.types";

interface Props {
  perusda: Perusda;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", perusda: Perusda): void;
  (e: "delete", perusda: Perusda): void;
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
  const name = props.perusda.createdByUser?.fullName || "Unknown";
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
  emit("edit", props.perusda);
};

const handleDelete = () => {
  emit("delete", props.perusda);
};

const handleOpenMaps = () => {
  if (props.perusda.maps) {
    window.open(props.perusda.maps, "_blank");
  }
};

const handleCallPhone = () => {
  window.open(`tel:${props.perusda.telepon}`, "_self");
};

const handleSendEmail = () => {
  window.open(`mailto:${props.perusda.email}`, "_self");
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
          {{ perusda.nama }}
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
              <span>{{ perusda.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(perusda.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :perusda="perusda" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Company Photo Card -->
    <Card v-if="perusda.foto && perusda.fotoUrl">
      <CardContent class="p-0">
        <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9">
          <img
            :src="perusda.fotoUrl"
            :alt="perusda.nama"
            class="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardContent>
    </Card>

    <!-- No Photo Fallback -->
    <Card v-else-if="!perusda.foto">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <Building class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada foto</p>
        </div>
      </CardContent>
    </Card>

    <!-- Contact Information Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Building class="h-5 w-5" />
          Informasi Kontak
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Contact Info Grid -->
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Alamat -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <MapPin class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Alamat</dt>
                <dd class="mt-1 text-sm leading-relaxed">{{ perusda.alamat }}</dd>
                <Button v-if="perusda.maps" variant="outline" size="sm" class="mt-2 gap-2" @click="handleOpenMaps">
                  <ExternalLink class="h-4 w-4" />
                  Lihat di Maps
                </Button>
              </div>
            </div>
          </div>

          <!-- Telepon -->
          <div class="bg-muted/50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                <Phone class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Telepon</dt>
                <dd class="mt-1 text-sm">{{ perusda.telepon }}</dd>
                <Button variant="outline" size="sm" class="mt-2 gap-2" @click="handleCallPhone">
                  <Phone class="h-4 w-4" />
                  Hubungi
                </Button>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="bg-muted/50 rounded-lg p-4 sm:col-span-2">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                <Mail class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1">
                <dt class="text-muted-foreground text-sm font-medium">Email</dt>
                <dd class="mt-1 text-sm">{{ perusda.email }}</dd>
                <Button variant="outline" size="sm" class="mt-2 gap-2" @click="handleSendEmail">
                  <Mail class="h-4 w-4" />
                  Kirim Email
                </Button>
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
                {{ perusda.createdByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(perusda.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="perusda.updatedAt && perusda.updatedAt !== perusda.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ perusda.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(perusda.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
