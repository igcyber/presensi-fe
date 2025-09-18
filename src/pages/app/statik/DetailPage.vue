<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import StatikDialog from "@/components/dialogs/StatikDialog.vue";
import StatikDetailView from "@/components/features/statik/StatikDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteStatik, getStatikById } from "@/lib/api/services/statik";
import type { StatikDetailResponse } from "@/lib/api/types/statik.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const statikId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<StatikDetailResponse>();
const confirmDialog = useDialog<StatikDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<StatikDetailResponse>,
  StatikDetailResponse
>(() => getStatikById(statikId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail statik", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.statik" });
};

const handleEdit = (statik: StatikDetailResponse) => {
  dialog.openEdit(statik);
};

const handleDelete = (statik: StatikDetailResponse) => {
  confirmDialog.openView(statik);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const statik = confirmDialog.state.value.data;
    await deleteStatik(statik.id);

    toast.success("Berhasil menghapus statik", {
      description: `Statik "${statik.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus statik";
    toast.error("Gagal menghapus statik", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleStatikDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (statikId.value > 0) {
    fetchData();
  } else {
    toast.error("ID statik tidak valid");
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
        <span class="text-muted-foreground">Memuat detail statik...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail statik'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <StatikDetailView
        :statik="data"
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
              Edit Statik
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Statik
            </Button>
          </div>
        </template>
      </StatikDetailView>
    </div>

    <!-- Edit Dialog -->
    <StatikDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :statik="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="handleStatikDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Statik"
      :description="`Apakah Anda yakin ingin menghapus statik '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
