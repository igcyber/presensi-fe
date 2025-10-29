<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import BaseConfirmDialog from "@/components/dialogs/BaseConfirmDialog.vue";
import BukuTamuDialog from "@/components/dialogs/BukuTamuDialog.vue";
import BukuTamuDetailView from "@/components/features/bukuTamu/BukuTamuDetailView.vue";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state/ErrorState.vue";

import { useDialog } from "@/composables/useDialog";
import { useFetch } from "@/composables/useFetch";
import type { ApiResponse } from "@/lib/api/core";
import { deleteBukuTamu, getBukuTamuById } from "@/lib/api/services/bukuTamu";
import type { BukuTamuDetailResponse } from "@/lib/api/types/bukuTamu.types";

// Router dan route
const route = useRoute();
const router = useRouter();

// Computed properties
const bukuTamuId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : 0;
});

// Composables
const dialog = useDialog<BukuTamuDetailResponse>();
const confirmDialog = useDialog<BukuTamuDetailResponse>();

const { data, isLoading, isError, error, fetchData } = useFetch<
  ApiResponse<BukuTamuDetailResponse>,
  BukuTamuDetailResponse
>(() => getBukuTamuById(bukuTamuId.value), {
  immediate: false,
  extractData: (response) => response.data,
  onError: (error) => {
    toast.error("Gagal memuat detail buku tamu", {
      description: error.message,
    });
  },
});

// Event handlers
const handleBack = () => {
  router.push({ name: "app.buku-tamu" });
};

const handleDelete = (item: BukuTamuDetailResponse) => {
  confirmDialog.openView(item);
};

const confirmDelete = async () => {
  if (!confirmDialog.state.value.data) return;

  try {
    confirmDialog.setLoading(true);
    const buku = confirmDialog.state.value.data;
    await deleteBukuTamu(buku.id);

    toast.success("Berhasil menghapus buku tamu", {
      description: `"${buku.judul}" telah dihapus`,
    });

    confirmDialog.closeDialog();
    handleBack();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Gagal menghapus buku tamu";
    toast.error("Gagal menghapus buku tamu", { description: errorMessage });
  } finally {
    confirmDialog.setLoading(false);
  }
};

const handleDialogSuccess = (): void => {
  dialog.closeDialog();
  fetchData();
};

// Lifecycle hooks
onMounted(() => {
  if (bukuTamuId.value > 0) {
    fetchData();
  } else {
    toast.error("ID buku tamu tidak valid");
    handleBack();
  }
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <!-- Loading -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="flex items-center gap-2">
        <div class="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span class="text-muted-foreground">Memuat detail Buku Tamu...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center">
      <ErrorState :message="error?.message || 'Gagal memuat detail buku tamu'" @retry="fetchData" />
    </div>

    <!-- Content -->
    <div v-else-if="data" class="py-6">
      <BukuTamuDetailView :buku="data" :show-back-button="true" @back="handleBack" @delete="handleDelete">
        <template #actions="{ onDelete }">
          <div class="flex flex-wrap gap-2">
            <Button variant="destructive" size="sm" @click="onDelete">
              <Trash2 class="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </template>
      </BukuTamuDetailView>

      <!-- Dialogs -->
      <BukuTamuDialog v-model:open="dialog.state.value.open" @success="handleDialogSuccess" />

      <BaseConfirmDialog
        v-model:open="confirmDialog.state.value.open"
        title="Hapus Buku Tamu"
        :description="`Apakah Anda yakin ingin menghapus buku tamu '${confirmDialog.state.value.data?.judul}'? Tindakan ini tidak dapat dibatalkan.`"
        confirm-text="Hapus"
        variant="destructive"
        :loading="confirmDialog.state.value.loading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
