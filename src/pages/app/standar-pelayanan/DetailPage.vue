<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import StandarPelayananDialog from "@/components/dialogs/StandarPelayananDialog.vue";
import StandarPelayananDetailView from "@/components/features/standarPelayanan/StandarPelayananDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteStandarPelayanan, getStandarPelayananById } from "@/lib/api/services/standarPelayanan";
import type { StandarPelayananDetailResponse } from "@/lib/api/types/standarPelayanan.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const standarPelayananId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<StandarPelayananDetailResponse>();
const confirmDialog = useDialog<StandarPelayananDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<StandarPelayananDetailResponse>,
  StandarPelayananDetailResponse
>(() => getStandarPelayananById(standarPelayananId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail standar pelayanan", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.standar-pelayanan" });
};

const handleEdit = (standarPelayanan: StandarPelayananDetailResponse) => {
  dialog.openEdit(standarPelayanan);
};

const handleDelete = (standarPelayanan: StandarPelayananDetailResponse) => {
  confirmDialog.openView(standarPelayanan);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const standarPelayanan = confirmDialog.state.value.data;
    await deleteStandarPelayanan(standarPelayanan.id);

    toast.success("Berhasil menghapus standar pelayanan", {
      description: `Standar pelayanan "${standarPelayanan.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus standar pelayanan";
    toast.error("Gagal menghapus standar pelayanan", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleStandarPelayananDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (standarPelayananId.value > 0) {
    fetchData();
  } else {
    toast.error("ID standar pelayanan tidak valid");
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
        <span class="text-muted-foreground">Memuat detail standar pelayanan...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail standar pelayanan'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <StandarPelayananDetailView
        :standar-pelayanan="data"
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
              Edit Standar Pelayanan
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Standar Pelayanan
            </Button>
          </div>
        </template>
      </StandarPelayananDetailView>
    </div>

    <!-- Edit Dialog -->
    <StandarPelayananDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode === 'view' ? 'edit' : dialog.state.value.mode"
      :standar-pelayanan="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="handleStandarPelayananDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Standar Pelayanan"
      :description="`Apakah Anda yakin ingin menghapus standar pelayanan '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
