<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KontenDialog from "@/components/dialogs/KontenDialog.vue";
import KontenDetailView from "@/components/features/konten/KontenDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteKonten, getKontenById } from "@/lib/api/services/konten";
import type { KontenDetailResponse } from "@/lib/api/types/konten.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const kontenId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<KontenDetailResponse>();
const confirmDialog = useDialog<KontenDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<KontenDetailResponse>,
  KontenDetailResponse
>(() => getKontenById(kontenId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail konten", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.konten" });
};

const handleEdit = (konten: KontenDetailResponse) => {
  dialog.openEdit(konten);
};

const handleDelete = (konten: KontenDetailResponse) => {
  confirmDialog.openView(konten);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const konten = confirmDialog.state.value.data;
    await deleteKonten(konten.id);

    toast.success("Berhasil menghapus konten", {
      description: `Konten "${konten.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus konten";
    toast.error("Gagal menghapus konten", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleKontenDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (kontenId.value > 0) {
    fetchData();
  } else {
    toast.error("ID konten tidak valid");
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
        <span class="text-muted-foreground">Memuat detail konten...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail konten'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <KontenDetailView
        :konten="data"
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
              Edit Konten
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Konten
            </Button>
          </div>
        </template>
      </KontenDetailView>
    </div>

    <!-- Edit Dialog -->
    <KontenDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :konten="dialog.state.value.data"
      widthClass="sm:max-w-[1000px]"
      @success="handleKontenDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Konten"
      :description="`Apakah Anda yakin ingin menghapus konten '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
