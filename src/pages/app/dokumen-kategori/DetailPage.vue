<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import DokumenDialog from "@/components/dialogs/DokumenDialog.vue";
import DokumenDetailView from "@/components/features/dokumen/DokumenDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteDokumen, getDokumenById } from "@/lib/api/services/dokumen";
import type { DokumenDetailResponse } from "@/lib/api/types/dokumen.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const dokumenId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<DokumenDetailResponse>();
const confirmDialog = useDialog<DokumenDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<DokumenDetailResponse>,
  DokumenDetailResponse
>(() => getDokumenById(dokumenId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail JDIH", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.dokumen" });
};

const handleEdit = (dokumen: DokumenDetailResponse) => {
  dialog.openEdit(dokumen);
};

const handleDelete = (dokumen: DokumenDetailResponse) => {
  confirmDialog.openView(dokumen);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const dokumen = confirmDialog.state.value.data;
    await deleteDokumen(dokumen.id);

    toast.success("Berhasil menghapus JDIH", {
      description: `JDIH "${dokumen.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus JDIH";
    toast.error("Gagal menghapus JDIH", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleDokumenDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (dokumenId.value > 0) {
    fetchData();
  } else {
    toast.error("ID JDIH tidak valid");
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
        <span class="text-muted-foreground">Memuat detail JDIH...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail JDIH'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <DokumenDetailView
        :dokumen="data"
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
              Edit JDIH
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus JDIH
            </Button>
          </div>
        </template>
      </DokumenDetailView>
    </div>

    <!-- Edit Dialog -->
    <DokumenDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :dokumen="dialog.state.value.data"
      widthClass="sm:max-w-[600px]"
      @success="handleDokumenDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus JDIH"
      :description="`Apakah Anda yakin ingin menghapus JDIH '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
