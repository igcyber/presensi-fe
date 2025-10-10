<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormatters } from "@/composables/useFormatters";
import type { Video } from "@/lib/api/types/video.types";

interface Props {
  video: Video;
  showBackButton?: boolean;
}

interface Emits {
  (e: "back"): void;
  (e: "edit", video: Video): void;
  (e: "delete", video: Video): void;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
});

const emit = defineEmits<Emits>();

const { date, youtubeInfo } = useFormatters();

// Methods
const handleBack = () => {
  emit("back");
};

const handleEdit = () => {
  emit("edit", props.video);
};

const handleDelete = () => {
  emit("delete", props.video);
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
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <i class="bx bx-play-circle text-3xl text-red-600"></i>
          </div>
          <div class="flex-1">
            <CardTitle class="mb-2">{{ video.judul }}</CardTitle>
            <CardDescription>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <i class="bx bx-calendar"></i>
                <span>{{ date(video.createdAt) }}</span>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Action Buttons Slot -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" :video="video" :on-edit="handleEdit" :on-delete="handleDelete">
            <!-- Default actions (can be overridden by parent) -->
            <Button variant="outline" size="sm" @click="handleEdit"> Edit </Button>
            <Button variant="destructive" size="sm" @click="handleDelete"> Hapus </Button>
          </slot>
        </div>

        <!-- Video Player -->
        <div class="aspect-video overflow-hidden rounded-lg border">
          <iframe
            :src="youtubeInfo(video.link).embedUrl"
            class="h-full w-full"
            frameborder="0"
            allowfullscreen
            loading="lazy"
            :title="video.judul"
          ></iframe>
        </div>

        <!-- Video Information -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Video</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3 rounded-lg border p-3">
                <i class="bx bx-video text-gray-400"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Judul</p>
                  <p class="font-medium">{{ video.judul }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-lg border p-3">
                <i class="bx bx-info-circle text-gray-400"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Deskripsi</p>
                  <p class="font-medium">{{ video.isi }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-lg border p-3">
                <i class="bx bx-link text-gray-400"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Link Video</p>
                  <p class="font-medium break-all text-blue-600">{{ video.link }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- System Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informasi Sistem</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-lg border p-3">
                <i class="bx bx-calendar text-gray-400"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Dibuat</p>
                  <p class="font-medium">{{ date(video.createdAt) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-lg border p-3">
                <i class="bx bx-calendar-edit text-gray-400"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                  <p class="font-medium">{{ date(video.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
