<script setup lang="ts">
import { ArrowLeft, Calendar, CalendarClock, Image, Link, User, UserCog } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { Foto } from "@/lib/api/types/foto.types";

interface Props {
  foto: Foto;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", foto: Foto): void;
  (e: "delete", foto: Foto): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const { date } = useFormatters();

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.foto);
};

const handleDelete = () => {
  emit("delete", props.foto);
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

    <!-- Main Content -->
    <Card>
      <CardHeader>
        <div class="flex items-start gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Image class="h-8 w-8 text-blue-600" />
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">{{ foto.judul }}</CardTitle>
            <CardDescription>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <Calendar class="h-4 w-4" />
                <span>{{ date(foto.createdAt) }}</span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :foto="foto" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>

        <!-- Image Display -->
        <div class="overflow-hidden rounded-lg border">
          <img
            :src="foto.fotoUrl || foto.foto_url"
            :alt="foto.judul"
            class="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Foto Information -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Foto</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3 rounded-lg border p-3">
                <Image class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Judul</p>
                  <p class="font-medium">{{ foto.judul }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-lg border p-3">
                <Link class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Path File</p>
                  <p class="font-medium break-all text-blue-600">{{ foto.foto }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-lg border p-3">
                <User class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Dibuat Oleh</p>
                  <p class="font-medium">{{ foto.createdByUser.fullName }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- System Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Sistem</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <Calendar class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Dibuat</p>
                  <p class="font-medium">{{ date(foto.createdAt) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <CalendarClock class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                  <p class="font-medium">{{ date(foto.updatedAt) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <UserCog class="h-4 w-4 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Diupdate Oleh</p>
                  <p class="font-medium">{{ foto.updatedByUser.fullName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
