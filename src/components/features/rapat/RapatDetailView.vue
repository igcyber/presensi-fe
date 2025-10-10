<script setup lang="ts">
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Rapat } from "@/lib/api/types/rapat.types";

interface Props {
  rapat: Rapat;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", rapat: Rapat): void;
  (e: "delete", rapat: Rapat): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date, time } = useFormatters();

// Computed properties
const creatorInitials = computed(() => {
  const name = props.rapat.createdByUser?.fullName || "Unknown";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const formattedDate = computed(() => {
  if (!props.rapat.tanggal) return "-";
  return date(props.rapat.tanggal);
});

const formattedTimeRange = computed(() => {
  if (!props.rapat.waktuMulai && !props.rapat.waktuBerakhir) return "-";

  const waktuMulai = props.rapat.waktuMulai ? time(props.rapat.waktuMulai) : "-";
  const waktuBerakhir = props.rapat.waktuBerakhir ? time(props.rapat.waktuBerakhir) : "-";

  if (waktuMulai === "-" && waktuBerakhir === "-") return "-";

  return `${waktuMulai} - ${waktuBerakhir}`;
});

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.rapat);
};

const handleDelete = () => {
  emit("delete", props.rapat);
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
          {{ rapat.judul }}
        </CardTitle>

        <!-- Meta Information -->
        <div
          class="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
        >
          <!-- Creator -->
          <div class="flex items-center gap-2">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">
                {{ creatorInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex items-center gap-1">
              <User class="h-4 w-4" />
              <span class="truncate">{{ rapat.createdByUser?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Tanggal -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <Badge variant="secondary" class="truncate">{{ formattedDate }}</Badge>
          </div>

          <!-- Waktu -->
          <div v-if="rapat.waktuMulai || rapat.waktuBerakhir" class="flex items-center gap-1">
            <Clock class="h-4 w-4" />
            <Badge variant="outline" class="truncate">{{ formattedTimeRange }}</Badge>
          </div>

          <!-- Lokasi -->
          <div v-if="rapat.lokasi" class="flex items-center gap-1">
            <MapPin class="h-4 w-4" />
            <span class="truncate">{{ rapat.lokasi }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :rapat="rapat" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Calendar class="h-5 w-5" />
          Agenda Rapat
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent class="space-y-4">
        <!-- Isi/Agenda -->
        <div class="bg-muted/50 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div class="min-w-0 flex-1">
              <dt class="text-muted-foreground mb-2 text-sm font-medium">Isi/Agenda Rapat</dt>
              <dd class="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {{ rapat.isi || "Tidak ada agenda yang dicantumkan" }}
              </dd>
            </div>
          </div>
        </div>

        <!-- Detail Information Grid -->
        <div class="grid gap-4 text-sm sm:grid-cols-2">
          <!-- Tanggal -->
          <div class="bg-muted/30 space-y-1 rounded-lg p-3">
            <div class="text-muted-foreground flex items-center gap-2">
              <Calendar class="h-4 w-4" />
              <span class="font-medium">Tanggal</span>
            </div>
            <p class="pl-6">{{ formattedDate }}</p>
          </div>

          <!-- Waktu -->
          <div class="bg-muted/30 space-y-1 rounded-lg p-3">
            <div class="text-muted-foreground flex items-center gap-2">
              <Clock class="h-4 w-4" />
              <span class="font-medium">Waktu</span>
            </div>
            <p class="pl-6">{{ formattedTimeRange }}</p>
          </div>

          <!-- Lokasi -->
          <div class="bg-muted/30 space-y-1 rounded-lg p-3 sm:col-span-2">
            <div class="text-muted-foreground flex items-center gap-2">
              <MapPin class="h-4 w-4" />
              <span class="font-medium">Lokasi</span>
            </div>
            <p class="pl-6">{{ rapat.lokasi || "-" }}</p>
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
              <p class="truncate">
                <span class="font-medium">Dibuat oleh:</span>
                {{ rapat.createdByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(rapat.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="rapat.updatedAt && rapat.updatedAt !== rapat.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p class="truncate">
                <span class="font-medium">Diperbarui oleh:</span>
                {{ rapat.updatedByUser?.fullName || "Unknown" }}
              </p>
              <p class="truncate">
                <span class="font-medium">Tanggal:</span>
                {{ date(rapat.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
