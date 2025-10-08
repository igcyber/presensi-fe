<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import FotoDialog from "@/components/dialogs/FotoDialog.vue";
import FotoDetailView from "@/components/features/foto/FotoDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteFoto, getFotoById } from "@/lib/api/services/foto";
import type { FotoDetailResponse } from "@/lib/api/types/foto.types";

// Router and router
const route = useRoute();
const router = useRouter();

// Get foto ID from route params
const fotoId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const editDialog = useDialog<FotoDetailResponse>();
const confirmDialog = useDialog<FotoDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<ApiResponse<FotoDetailResponse>, FotoDetailResponse>(
  () => getFotoById(fotoId.value),
  {
    immediate: false,
    extractData: (response) => response.data,
    onError: (error) => {
      toast.error("Gagal memuat detail foto", {
        description: error.message,
      });
    },
  },
);

// Methods
const handleBack = () => {
  router.push({ name: "app.foto" });
};

const handleEdit = (foto: FotoDetailResponse) => {
  editDialog.openEdit(foto);
};

const handleDelete = (foto: FotoDetailResponse) => {
  confirmDialog.openView(foto);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const foto = confirmDialog.state.value.data;
    await deleteFoto(foto.id);

    toast.success("Berhasil menghapus foto", {
      description: `Foto "${foto.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack(); // kembali ke list setelah delete
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus foto";
    toast.error("Gagal menghapus foto", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

// Lifecycle
onMounted(() => {
  if (fotoId.value > 0) {
    fetchData();
  } else {
    toast.error("ID foto tidak valid");
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
        <span class="text-muted-foreground">Memuat detail foto...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail foto'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <FotoDetailView
        :foto="data"
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
              Edit Foto
            </Button>
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus Foto
            </Button>
          </div>
        </template>
      </FotoDetailView>
    </div>

    <!-- Edit Dialog -->
    <FotoDialog
      v-model:open="editDialog.state.value.open"
      :mode="editDialog.state.value.mode"
      :foto="editDialog.state.value.data"
      widthClass="sm:max-w-[700px]"
      @success="fetchData"
    />

    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      v-model:open="confirmDialog.state.value.open"
      title="Hapus Foto"
      :description="`Apakah Anda yakin ingin menghapus foto '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Hapus"
      variant="destructive"
      :loading="confirmDialog.state.value.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
