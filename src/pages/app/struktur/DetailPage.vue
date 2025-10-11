<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import StrukturDialog from "@/components/dialogs/StrukturDialog.vue";
import StrukturDetailView from "@/components/features/struktur/StrukturDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteStruktur, getStrukturById } from "@/lib/api/services/struktur";
import type { StrukturDetailResponse } from "@/lib/api/types/struktur.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const strukturId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<StrukturDetailResponse>();
const confirmDialog = useDialog<StrukturDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<StrukturDetailResponse>,
  StrukturDetailResponse
>(() => getStrukturById(strukturId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail struktur", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.struktur" });
};

const handleEdit = (struktur: StrukturDetailResponse) => {
  dialog.openEdit(struktur);
};

const handleDelete = (struktur: StrukturDetailResponse) => {
  confirmDialog.openView(struktur);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const struktur = confirmDialog.state.value.data;
    await deleteStruktur(struktur.id);

    toast.success("Berhasil menghapus struktur", {
      description: `Struktur "${struktur.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus struktur";
    toast.error("Gagal menghapus struktur", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleStrukturDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (strukturId.value > 0) {
    fetchData();
  } else {
    toast.error("ID struktur tidak valid");
    handleBack();
  }
});

watch(strukturId, () => {
  if (strukturId.value > 0) {
    fetchData();
  } else {
    toast.error("ID struktur tidak valid");
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
        <span class="text-muted-foreground">Memuat detail struktur...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail struktur'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <StrukturDetailView
        :struktur="data"
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
              Edit Struktur
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Struktur
            </Button>
          </div>
        </template>
      </StrukturDetailView>
    </div>

    <!-- Edit Dialog -->
    <StrukturDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :struktur="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleStrukturDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Struktur"
      :description="`Apakah Anda yakin ingin menghapus struktur '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
