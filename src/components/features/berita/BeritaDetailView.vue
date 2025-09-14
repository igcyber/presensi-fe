<script setup lang="ts">
import { ArrowLeft, Building, Calendar, User } from "lucide-vue-next";
import { computed } from "vue";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormatters } from "@/composables/useFormatters";
import type { Berita } from "@/lib/api/types/berita.types";

interface Props {
  berita: Berita;
  showBackButton?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", berita: Berita): void;
  (e: "delete", berita: Berita): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  loading: false,
});

const emit = defineEmits<Emits>();

// Composables
const { date } = useFormatters();

// Computed properties
const formattedTags = computed(() => {
  if (!props.berita.tag) return [];
  return props.berita.tag
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
});

const creatorInitials = computed(() => {
  const name = props.berita.creator?.fullName || "Unknown";
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
  emit("edit", props.berita);
};

const handleDelete = () => {
  emit("delete", props.berita);
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
          {{ berita.judul }}
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
              <span>{{ berita.creator?.fullName || "Unknown" }}</span>
            </div>
          </div>

          <!-- OPD -->
          <div class="flex items-center gap-1">
            <Building class="h-4 w-4" />
            <span>{{ berita.opd.nama }}</span>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ date(berita.createdAt) }}</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="formattedTags.length > 0" class="flex flex-wrap gap-2">
          <Badge v-for="tag in formattedTags" :key="tag" variant="secondary" class="text-xs">
            {{ tag }}
          </Badge>
        </div>

        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :berita="berita" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>
      </CardHeader>
    </Card>

    <!-- Photo Card -->
    <Card v-if="berita.foto && berita.fotoUrl">
      <CardContent class="p-0">
        <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9">
          <img
            :src="berita.fotoUrl"
            :alt="berita.judul"
            class="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <!-- Photo Caption -->
        <div v-if="berita.keterangan" class="p-4">
          <p class="text-muted-foreground text-sm italic">
            {{ berita.keterangan }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- No Photo Fallback -->
    <Card v-else-if="!berita.foto">
      <CardContent class="p-8 text-center">
        <div class="text-muted-foreground">
          <Building class="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p class="text-sm">Tidak ada foto</p>
        </div>
      </CardContent>
    </Card>

    <Separator />

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Isi Berita</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div class="text-foreground leading-relaxed" v-html="berita.isi"></div>
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
                {{ berita.creator?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(berita.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Updated Info (if different from created) -->
          <div v-if="berita.updatedAt && berita.updatedAt !== berita.createdAt" class="space-y-1">
            <p class="text-foreground font-medium">Informasi Update</p>
            <div class="text-muted-foreground space-y-1">
              <p>
                <span class="font-medium">Diperbarui oleh:</span>
                {{ berita.updater?.fullName || "Unknown" }}
              </p>
              <p>
                <span class="font-medium">Tanggal:</span>
                {{ date(berita.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
