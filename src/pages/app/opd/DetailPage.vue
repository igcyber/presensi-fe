<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import OpdDialog from "@/components/dialogs/OpdDialog.vue";
import OpdDetailView from "@/components/features/opd/OpdDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteOpd, getOpdById } from "@/lib/api/services/opd";
import type { OpdDetailResponse } from "@/lib/api/types/opd.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const opdId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<OpdDetailResponse>();
const confirmDialog = useDialog<OpdDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<OpdDetailResponse>, OpdDetailResponse>(
  () => getOpdById(opdId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail OPD", {
        description: error.message,
      });
    },
  },
);

// Event handlers
const handleBack = () => {
  router.push({ name: "app.opd" });
};

const handleEdit = (opd: OpdDetailResponse) => {
  dialog.openEdit(opd);
};

const handleDelete = (opd: OpdDetailResponse) => {
  confirmDialog.openView(opd);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const opd = confirmDialog.state.value.data;
    await deleteOpd(opd.id);

    toast.success("Berhasil menghapus OPD", {
      description: `OPD "${opd.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus OPD";
    toast.error("Gagal menghapus OPD", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleOpdDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (opdId.value > 0) {
    fetchData();
  } else {
    toast.error("ID OPD tidak valid");
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
        <span class="text-muted-foreground">Memuat detail OPD...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail OPD'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <OpdDetailView :opd="data" :show-back-button="true" @back="handleBack" @edit="handleEdit" @delete="handleDelete">
        <!-- Custom action buttons via slot -->
        <template #actions="{ onEdit, onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="onEdit">
              <Edit class="mr-2 h-4 w-4" />
              Edit OPD
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus OPD
            </Button>
          </div>
        </template>
      </OpdDetailView>
    </div>

    <!-- Edit Dialog -->
    <OpdDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :opd="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleOpdDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus OPD"
      :description="`Apakah Anda yakin ingin menghapus OPD '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
