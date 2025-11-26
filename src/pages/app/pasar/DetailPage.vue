<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import PasarDialog from "@/components/dialogs/PasarDialog.vue";
import PasarDetailView from "@/components/features/pasar/PasarDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deletePasar, getPasarById } from "@/lib/api/services/pasar";
import type { PasarDetail } from "@/lib/api/types/pasar.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get pasar ID from route params
const pasarId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<PasarDetail>();
const confirmDialog = useDialog<PasarDetail>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<PasarDetail>, PasarDetail>(
  () => getPasarById(pasarId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail pasar", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.pasar" });
};

const handleEdit = (pasar: PasarDetail) => {
  editDialog.openEdit(pasar);
};

const handleDelete = (pasar: PasarDetail) => {
  confirmDialog.openView(pasar);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const pasar = confirmDialog.state.value.data;
    await deletePasar(pasar.id);

    toast.success("Berhasil menghapus pasar", {
      description: `Pasar "${pasar.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus pasar";
    toast.error("Gagal menghapus pasar", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (pasarId.value > 0) {
    fetchData();
  } else {
    toast.error("ID pasar tidak valid");
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
        <span class="text-muted-foreground">Memuat detail pasar...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail pasar'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <PasarDetailView
        :pasar="data"
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
              Edit Pasar
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Pasar
            </Button>
          </div>
        </template>
      </PasarDetailView>
    </div>

    <!-- Edit Dialog -->
    <PasarDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :pasar="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Pasar"
      :description="`Apakah Anda yakin ingin menghapus pasar '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
