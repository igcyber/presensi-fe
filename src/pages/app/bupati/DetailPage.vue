<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BupatiDialog from "@/components/dialogs/BupatiDialog.vue";
import BupatiDetailView from "@/components/features/bupati/BupatiDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteBupati, getBupatiById } from "@/lib/api/services/bupati";
import type { BupatiDetailResponse } from "@/lib/api/types/bupati.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const bupatiId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<BupatiDetailResponse>();
const confirmDialog = useDialog<BupatiDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<BupatiDetailResponse>,
  BupatiDetailResponse
>(() => getBupatiById(bupatiId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail bupati", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.bupati" });
};

const handleEdit = (bupati: BupatiDetailResponse) => {
  dialog.openEdit(bupati);
};

const handleDelete = (bupati: BupatiDetailResponse) => {
  confirmDialog.openView(bupati);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const bupati = confirmDialog.state.value.data;
    await deleteBupati(bupati.id);

    toast.success("Berhasil menghapus data bupati", {
      description: `Data "${bupati.namaBupati}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus data bupati";
    toast.error("Gagal menghapus data bupati", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleBupatiDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (bupatiId.value > 0) {
    fetchData();
  } else {
    toast.error("ID bupati tidak valid");
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
        <span class="text-muted-foreground">Memuat detail bupati...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail bupati'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <BupatiDetailView
        :bupati="data"
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
              Edit Bupati
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Bupati
            </Button>
          </div>
        </template>
      </BupatiDetailView>
    </div>

    <!-- Edit Dialog -->
    <BupatiDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :bupati="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="handleBupatiDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Data Bupati"
      :description="`Apakah Anda yakin ingin menghapus data bupati '${confirmDialog.state.value.data?.namaBupati}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
