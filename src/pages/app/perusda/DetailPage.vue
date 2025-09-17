<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PerusdaDialog from "@/components/dialogs/PerusdaDialog.vue";
import PerusdaDetailView from "@/components/features/perusda/PerusdaDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePerusda, getPerusdaById } from "@/lib/api/services/perusda";
import type { PerusdaDetailResponse } from "@/lib/api/types/perusda.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const perusdaId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<PerusdaDetailResponse>();
const confirmDialog = useDialog<PerusdaDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<PerusdaDetailResponse>,
  PerusdaDetailResponse
>(() => getPerusdaById(perusdaId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail perusda", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.perusda" });
};

const handleEdit = (perusda: PerusdaDetailResponse) => {
  dialog.openEdit(perusda);
};

const handleDelete = (perusda: PerusdaDetailResponse) => {
  confirmDialog.openView(perusda);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const perusda = confirmDialog.state.value.data;
    await deletePerusda(perusda.id);

    toast.success("Berhasil menghapus perusda", {
      description: `Perusda "${perusda.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus perusda";
    toast.error("Gagal menghapus perusda", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handlePerusdaDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (perusdaId.value > 0) {
    fetchData();
  } else {
    toast.error("ID perusda tidak valid");
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
        <span class="text-muted-foreground">Memuat detail perusda...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail perusda'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PerusdaDetailView
        :perusda="data"
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
              Edit Perusda
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Perusda
            </Button>
          </div>
        </template>
      </PerusdaDetailView>
    </div>

    <!-- Edit Dialog -->
    <PerusdaDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :perusda="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handlePerusdaDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Perusda"
      :description="`Apakah Anda yakin ingin menghapus perusda '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
