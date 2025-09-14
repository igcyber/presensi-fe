<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import VideoDialog from "@/components/dialogs/VideoDialog.vue";
import VideoDetailView from "@/components/features/video/VideoDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteVideo, getVideoById } from "@/lib/api/services/video";
import type { VideoDetailResponse } from "@/lib/api/types/video.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get video ID from route params
const videoId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<VideoDetailResponse>();
const confirmDialog = useDialog<VideoDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<VideoDetailResponse>, VideoDetailResponse>(
  () => getVideoById(videoId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail video", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.video" });
};

const handleEdit = (video: VideoDetailResponse) => {
  editDialog.openEdit(video);
};

const handleDelete = (video: VideoDetailResponse) => {
  confirmDialog.openView(video);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const video = confirmDialog.state.value.data;
    await deleteVideo(video.id);

    toast.success("Berhasil menghapus video", {
      description: `Video "${video.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus video";
    toast.error("Gagal menghapus video", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (videoId.value > 0) {
    fetchData();
  } else {
    toast.error("ID video tidak valid");
    handleBack();
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail video...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail video'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <VideoDetailView
        :video="data"
        :show-back-button="true"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit Video
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Video
            </Button>
          </div>
        </template>
      </VideoDetailView>
    </div>

    <!-- Edit Dialog -->
    <VideoDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :video="editDialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Video"
      :description="`Apakah Anda yakin ingin menghapus video '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
