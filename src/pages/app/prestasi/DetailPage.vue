<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PrestasiDialog from "@/components/dialogs/PrestasiDialog.vue";
import PrestasiDetailView from "@/components/features/prestasi/PrestasiDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePrestasi, getPrestasiById } from "@/lib/api/services/prestasi";
import type { PrestasiDetailResponse } from "@/lib/api/types/prestasi.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const prestasiId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<PrestasiDetailResponse>();
const confirmDialog = useDialog<PrestasiDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<PrestasiDetailResponse>,
  PrestasiDetailResponse
>(() => getPrestasiById(prestasiId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail prestasi", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.prestasi" });
};

const handleEdit = (prestasi: PrestasiDetailResponse) => {
  dialog.openEdit(prestasi);
};

const handleDelete = (prestasi: PrestasiDetailResponse) => {
  confirmDialog.openView(prestasi);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const prestasi = confirmDialog.state.value.data;
    await deletePrestasi(prestasi.id);

    toast.success("Berhasil menghapus prestasi", {
      description: `Prestasi "${prestasi.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus prestasi";
    toast.error("Gagal menghapus prestasi", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePrestasiDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (prestasiId.value > 0) {
    fetchData();
  } else {
    toast.error("ID prestasi tidak valid");
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
        <span class="text-muted-foreground">Memuat detail prestasi...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail prestasi'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PrestasiDetailView
        :prestasi="data"
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
              Edit Prestasi
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Prestasi
            </Button>
          </div>
        </template>
      </PrestasiDetailView>
    </div>

    <!-- Edit Dialog -->
    <PrestasiDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :prestasi="dialog.state.value.data"
      widthClass="sm:max-w-[800px]"
      @success="handlePrestasiDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Prestasi"
      :description="`Apakah Anda yakin ingin menghapus prestasi '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
