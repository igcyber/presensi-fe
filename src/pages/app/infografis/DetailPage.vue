<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import InfografisDialog from "@/components/dialogs/InfografisDialog.vue";
import InfografisDetailView from "@/components/features/infografis/InfografisDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteInfografis, getInfografisById } from "@/lib/api/services/infografis";
import type { InfografisDetailResponse } from "@/lib/api/types/infografis.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const infografisId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<InfografisDetailResponse>();
const confirmDialog = useDialog<InfografisDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<InfografisDetailResponse>,
  InfografisDetailResponse
>(() => getInfografisById(infografisId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail infografis", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.infografis" });
};

const handleEdit = (infografis: InfografisDetailResponse) => {
  dialog.openEdit(infografis);
};

const handleDelete = (infografis: InfografisDetailResponse) => {
  confirmDialog.openView(infografis);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const infografis = confirmDialog.state.value.data;
    await deleteInfografis(infografis.id);

    toast.success("Berhasil menghapus infografis", {
      description: `Infografis "${infografis.nama}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus infografis";
    toast.error("Gagal menghapus infografis", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (infografisId.value > 0) {
    fetchData();
  } else {
    toast.error("ID infografis tidak valid");
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
        <span class="text-muted-foreground">Memuat detail infografis...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail infografis'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <InfografisDetailView
        :infografis="data"
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
              Edit Infografis
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Infografis
            </Button>
          </div>
        </template>
      </InfografisDetailView>
    </div>

    <!-- Edit Dialog -->
    <InfografisDialog
      v-model:open="dialog.state.value.open"
      :mode="dialog.state.value.mode"
      :infografis="dialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Infografis"
      :description="`Apakah Anda yakin ingin menghapus infografis '${confirmDialog.state.value.data?.nama}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
