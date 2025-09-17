<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import LayananDialog from "@/components/dialogs/LayananDialog.vue";
import LayananDetailView from "@/components/features/layanan/LayananDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteLayanan, getLayananById } from "@/lib/api/services/layanan";
import type { LayananDetailResponse } from "@/lib/api/types/layanan.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const layananId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<LayananDetailResponse>();
const confirmDialog = useDialog<LayananDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<LayananDetailResponse>,
  LayananDetailResponse
>(() => getLayananById(layananId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail layanan", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.layanan" });
};

const handleEdit = (layanan: LayananDetailResponse) => {
  dialog.openEdit(layanan);
};

const handleDelete = (layanan: LayananDetailResponse) => {
  confirmDialog.openView(layanan);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const layanan = confirmDialog.state.value.data;
    await deleteLayanan(layanan.id);

    toast.success("Berhasil menghapus layanan", {
      description: `Layanan "${layanan.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus layanan";
    toast.error("Gagal menghapus layanan", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleLayananDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (layananId.value > 0) {
    fetchData();
  } else {
    toast.error("ID layanan tidak valid");
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
        <span class="text-muted-foreground">Memuat detail layanan...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail layanan'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <LayananDetailView
        :layanan="data"
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
              Edit Layanan
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Layanan
            </Button>
          </div>
        </template>
      </LayananDetailView>
    </div>

    <!-- Edit Dialog -->
    <LayananDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :layanan="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleLayananDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Layanan"
      :description="`Apakah Anda yakin ingin menghapus layanan '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
