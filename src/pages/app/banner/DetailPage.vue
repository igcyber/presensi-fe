<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BannerDialog from "@/components/dialogs/BannerDialog.vue";
import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BannerDetailView from "@/components/features/banner/BannerDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteBanner, getBannerById } from "@/lib/api/services/banner";
import type { BannerDetailResponse } from "@/lib/api/types/banner.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const bannerId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<BannerDetailResponse>();
const confirmDialog = useDialog<BannerDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<BannerDetailResponse>,
  BannerDetailResponse
>(() => getBannerById(bannerId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail banner", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.banner" });
};

const handleEdit = (banner: BannerDetailResponse) => {
  dialog.openEdit(banner);
};

const handleDelete = (banner: BannerDetailResponse) => {
  confirmDialog.openView(banner);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const banner = confirmDialog.state.value.data;
    await deleteBanner(banner.id);

    toast.success("Berhasil menghapus banner", {
      description: `Banner "${banner.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus banner";
    toast.error("Gagal menghapus banner", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleBannerDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (bannerId.value > 0) {
    fetchData();
  } else {
    toast.error("ID banner tidak valid");
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
        <span class="text-muted-foreground">Memuat detail banner...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail banner'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <BannerDetailView
        :banner="data"
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
              Edit Banner
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Banner
            </Button>
          </div>
        </template>
      </BannerDetailView>
    </div>

    <!-- Edit Dialog -->
    <BannerDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :banner="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleBannerDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Banner"
      :description="`Apakah Anda yakin ingin menghapus banner '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
