<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import KiosDialog from "@/components/dialogs/KiosDialog.vue";
import KiosDetailView from "@/components/features/kios/KiosDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteKios, getKiosById } from "@/lib/api/services/kios";
import type { KiosDetail } from "@/lib/api/types/kios.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get kios ID from route params
const kiosId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<KiosDetail>();
const confirmDialog = useDialog<KiosDetail>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<KiosDetail>, KiosDetail>(
  () => getKiosById(kiosId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail kios", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.kios" });
};

const handleEdit = (kios: KiosDetail) => {
  editDialog.openEdit(kios);
};

const handleDelete = (kios: KiosDetail) => {
  confirmDialog.openView(kios);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const kios = confirmDialog.state.value.data;
    await deleteKios(kios.id);

    toast.success("Berhasil menghapus kios", {
      description: `Kios "${kios.kode}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus kios";
    toast.error("Gagal menghapus kios", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (kiosId.value > 0) {
    fetchData();
  } else {
    toast.error("ID kios tidak valid");
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
        <span class="text-muted-foreground">Memuat detail kios...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail kios'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <KiosDetailView
        :kios="data"
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
              Edit Kios
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Kios
            </Button>
          </div>
        </template>
      </KiosDetailView>
    </div>

    <!-- Edit Dialog -->
    <KiosDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :kios="editDialog.state.value.data"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Kios"
      :description="`Apakah Anda yakin ingin menghapus kios '${confirmDialog.state.value.data?.kode}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
