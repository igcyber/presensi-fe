<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import AplikasiTerkaitDialog from "@/components/dialogs/AplikasiTerkaitDialog.vue";
import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import AplikasiTerkaitDetailView from "@/components/features/aplikasiTerkait/AplikasiTerkaitDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteAplikasiTerkait, getAplikasiTerkaitById } from "@/lib/api/services/aplikasiTerkait";
import type { AplikasiTerkaitDetailResponse } from "@/lib/api/types/aplikasiTerkait.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const aplikasiTerkaitId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<AplikasiTerkaitDetailResponse>();
const confirmDialog = useDialog<AplikasiTerkaitDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<AplikasiTerkaitDetailResponse>,
  AplikasiTerkaitDetailResponse
>(() => getAplikasiTerkaitById(aplikasiTerkaitId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail aplikasi terkait", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.aplikasi-terkait" });
};

const handleEdit = (aplikasiTerkait: AplikasiTerkaitDetailResponse) => {
  dialog.openEdit(aplikasiTerkait);
};

const handleDelete = (aplikasiTerkait: AplikasiTerkaitDetailResponse) => {
  confirmDialog.openView(aplikasiTerkait);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const aplikasiTerkait = confirmDialog.state.value.data;
    await deleteAplikasiTerkait(aplikasiTerkait.id);

    toast.success("Berhasil menghapus aplikasi terkait", {
      description: `Aplikasi terkait "${aplikasiTerkait.text}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus aplikasi terkait";
    toast.error("Gagal menghapus aplikasi terkait", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleAplikasiTerkaitDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (aplikasiTerkaitId.value > 0) {
    fetchData();
  } else {
    toast.error("ID aplikasi terkait tidak valid");
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
        <span class="text-muted-foreground">Memuat detail aplikasi terkait...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail aplikasi terkait'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <AplikasiTerkaitDetailView
        :aplikasi-terkait="data"
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
              Edit Aplikasi
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Aplikasi
            </Button>
          </div>
        </template>
      </AplikasiTerkaitDetailView>
    </div>

    <!-- Edit Dialog -->
    <AplikasiTerkaitDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :aplikasi-terkait="dialog.state.value.data"
      widthClass="sm:max-w-[500px]"
      @success="handleAplikasiTerkaitDialogSuccess"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Aplikasi Terkait"
      :description="`Apakah Anda yakin ingin menghapus aplikasi terkait '${confirmDialog.state.value.data?.text}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
