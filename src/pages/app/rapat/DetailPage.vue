<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import RapatDialog from "@/components/dialogs/RapatDialog.vue";
import RapatDetailView from "@/components/features/rapat/RapatDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteRapat, getRapatById } from "@/lib/api/services/rapat";
import type { RapatDetailResponse } from "@/lib/api/types/rapat.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const rapatId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<RapatDetailResponse>();
const confirmDialog = useDialog<RapatDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<RapatDetailResponse>, RapatDetailResponse>(
  () => getRapatById(rapatId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail rapat", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.rapat" });
};

const handleEdit = (rapat: RapatDetailResponse) => {
  dialog.openEdit(rapat);
};

const handleDelete = (rapat: RapatDetailResponse) => {
  confirmDialog.openView(rapat);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const rapat = confirmDialog.state.value.data;
    await deleteRapat(rapat.id);

    toast.success("Berhasil menghapus rapat", {
      description: `Rapat "${rapat.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus rapat";
    toast.error("Gagal menghapus rapat", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleRapatDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (rapatId.value > 0) {
    fetchData();
  } else {
    toast.error("ID rapat tidak valid");
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
        <span class="text-muted-foreground">Memuat detail rapat...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail rapat'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <RapatDetailView
        :rapat="data"
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
              Edit Rapat
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Rapat
            </Button>
          </div>
        </template>
      </RapatDetailView>
    </div>

    <!-- Edit Dialog -->
    <RapatDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :rapat="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleRapatDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Rapat"
      :description="`Apakah Anda yakin ingin menghapus rapat '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
