<script setup lang="ts">
import { ArrowLeft, Calendar, FileText, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Konten } from "@/lib/api/types/konten.types";

interface Props {
  konten: Konten;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", konten: Konten): void;
  (e: "delete", konten: Konten): void;
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
  const name = props.konten.creator?.fullName || "Unknown";
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
  emit("edit", props.konten);
};

const handleDelete = () => {
  emit("delete", props.konten);
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
          {{ konten.nama }}
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
              <span>{{ konten.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- Slug -->
          <div class="flex items-center gap-1">
            <FileText class="h-4 w-4" />
            <span class="font-mono text-xs">{{ konten.slug }}</span>
          </div>

          <!-- Created Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(konten.createdAt) }}</span>
          </div>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :konten="konten" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Photo Card -->
    <Card v-if="konten.foto && konten.fotoUrl">
      <CardContent class="p-0">
        <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9">
          <img
            :src="konten.fotoUrl"
            :alt="konten.nama"
            class="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardContent>
    </Card>

    <!-- No Photo Fallback -->
    <Card v-else-if="!konten.foto">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <FileText class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada foto</p>
        </div>
      </CardContent>
    </Card>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Isi Konten</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed" v-html="konten.isi"></div>
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
                {{ konten.creator?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(konten.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="konten.updatedAt && konten.updatedAt !== konten.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ konten.updater?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(konten.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
